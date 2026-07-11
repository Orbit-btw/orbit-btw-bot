module.exports = (app) => {
  // 1. Welcome first time issue creators
  app.on("issues.opened", async (context) => {
    if (context.isBot) return;
    const authorAssociation = context.payload.issue.author_association;
    
    if (authorAssociation === "FIRST_TIMER" || authorAssociation === "FIRST_TIME_CONTRIBUTOR") {
      const reply = context.issue({
        body: `👋 Welcome to the **Orbit-btw** organization! Thank you so much for opening your first issue here. Please make sure you've read our contributing guidelines. We're glad to have you! 🎉`
      });
      await context.octokit.issues.createComment(reply);
    }
  });

  // 2. Welcome first time PR creators
  app.on("pull_request.opened", async (context) => {
    if (context.isBot) return;
    const authorAssociation = context.payload.pull_request.author_association;
    
    if (authorAssociation === "FIRST_TIMER" || authorAssociation === "FIRST_TIME_CONTRIBUTOR") {
      const reply = context.issue({
        body: `🚀 Congratulations on opening your first Pull Request in the **Orbit-btw** organization! A maintainer will review your code shortly. Thank you for your contribution!`
      });
      await context.octokit.issues.createComment(reply);
    }
  });

  // 3. Welcome first time commenters (if they aren't just typing a command)
  app.on("issue_comment.created", async (context) => {
    if (context.isBot) return;
    const commentBody = context.payload.comment.body.trim();
    const authorAssociation = context.payload.comment.author_association;
    
    if (context.payload.action === 'created' && (authorAssociation === "FIRST_TIMER" || authorAssociation === "FIRST_TIME_CONTRIBUTOR")) {
      if (!commentBody.startsWith("/")) {
        const reply = context.issue({
          body: `👋 Welcome! Thank you for your first comment in this repository. We appreciate your input!`
        });
        await context.octokit.issues.createComment(reply);
      }
    }
  });
};
