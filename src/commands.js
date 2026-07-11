const { reactToComment, removeLabelSafe } = require('./helpers');

module.exports = (app) => {
  app.on("issue_comment.created", async (context) => {
    if (context.isBot) return;

    const commentBody = context.payload.comment.body.trim();
    const user = context.payload.comment.user.login;
    const org = context.payload.repository.owner.login;
    const authorAssociation = context.payload.comment.author_association;
    const isMember = ['MEMBER', 'OWNER', 'COLLABORATOR'].includes(authorAssociation);

    // Command: /claim or /assign
    if (commentBody.startsWith("/claim") || commentBody.startsWith("/assign")) {
      // 1. Check if the issue is already assigned
      if (context.payload.issue.assignees && context.payload.issue.assignees.length > 0) {
        const assigneesList = context.payload.issue.assignees.map(a => `@${a.login}`).join(', ');
        return context.octokit.issues.createComment(context.issue({
          body: `Sorry @${user}, this issue is already claimed by ${assigneesList}.`
        }));
      }

      // 2. Global Org Limit: 1 active issue per user across the WHOLE organization
      try {
        const { data: searchResults } = await context.octokit.search.issuesAndPullRequests({
          q: `org:${org} assignee:${user} state:open is:issue`
        });
        
        if (searchResults.total_count > 0) {
          const existingIssue = searchResults.items[0];
          return context.octokit.issues.createComment(context.issue({
            body: `Sorry @${user}, you are already assigned to an issue somewhere in the organization (${existingIssue.html_url}). Please finish or \`/unclaim\` that one before claiming a new task!`
          }));
        }
      } catch (err) {
        context.log.error(err);
      }

      // 3. Assign the user
      try {
        await context.octokit.issues.addAssignees(context.issue({ assignees: [user] }));
        
        // 4. Auto-labels
        await context.octokit.issues.addLabels(context.issue({ labels: ['in-progress'] }));
        await removeLabelSafe(context, 'help wanted');
        await removeLabelSafe(context, 'good first issue');

        // 5. React instead of spamming a comment
        await reactToComment(context, 'rocket');
      } catch (err) {
        context.log.error(err);
        await context.octokit.issues.createComment(context.issue({
          body: `Oops! I couldn't assign you. Error: \`${err.message}\``
        }));
      }
    }

    // Command: /unclaim or /unassign
    if (commentBody.startsWith("/unclaim") || commentBody.startsWith("/unassign")) {
      const isAssigned = context.payload.issue.assignees.some(a => a.login === user);
      if (!isAssigned) {
        return context.octokit.issues.createComment(context.issue({
          body: `You cannot unclaim this issue because you aren't assigned to it, @${user}.`
        }));
      }

      try {
        await context.octokit.issues.removeAssignees(context.issue({ assignees: [user] }));
        await removeLabelSafe(context, 'in-progress');
        await context.octokit.issues.addLabels(context.issue({ labels: ['help wanted'] }));
        await reactToComment(context, '+1');
      } catch (err) {
        context.log.error(err);
      }
    }

    // Command: /close (Restricted)
    if (commentBody.startsWith("/close")) {
      if (!isMember) {
        return context.octokit.issues.createComment(context.issue({
          body: `Sorry @${user}, only organization members can use the \`/close\` command.`
        }));
      }
      try {
        await context.octokit.issues.update(context.issue({ state: "closed" }));
        await reactToComment(context, 'heart');
      } catch (err) {
        context.log.error(err);
        await context.octokit.issues.createComment(context.issue({
          body: `Oops! Error closing the issue: \`${err.message}\``
        }));
      }
    }

    // Command: /label <name> (Restricted)
    if (commentBody.startsWith("/label ")) {
      if (!isMember) return await reactToComment(context, 'confused');
      const label = commentBody.replace("/label ", "").trim();
      if (label) {
        try {
          await context.octokit.issues.addLabels(context.issue({ labels: [label] }));
          await reactToComment(context, '+1');
        } catch (err) {
          context.log.error(err);
        }
      }
    }

    // Command: /unlabel <name> (Restricted)
    if (commentBody.startsWith("/unlabel ")) {
      if (!isMember) return await reactToComment(context, 'confused');
      const label = commentBody.replace("/unlabel ", "").trim();
      if (label) {
        try {
          await removeLabelSafe(context, label);
          await reactToComment(context, '+1');
        } catch (err) {
          context.log.error(err);
        }
      }
    }
  });
};
