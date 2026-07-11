module.exports.reactToComment = async (context, reaction) => {
  try {
    await context.octokit.reactions.createForIssueComment({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      comment_id: context.payload.comment.id,
      content: reaction // e.g., 'rocket', 'eyes', 'heart', '+1', 'confused'
    });
  } catch (e) {
    context.log.error("Failed to react to comment:", e);
  }
};

module.exports.removeLabelSafe = async (context, labelName) => {
  try {
    await context.octokit.issues.removeLabel(context.issue({ name: labelName }));
  } catch (e) {
    // Ignored: Label probably didn't exist on the issue
  }
};
