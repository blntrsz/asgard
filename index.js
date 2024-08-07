console.log(process.env.CODEBUILD_WEBHOOK_ACTOR_ACCOUNT_ID);
console.log(process.env.CODEBUILD_WEBHOOK_BASE_REF);
console.log(process.env.CODEBUILD_WEBHOOK_EVENT);
console.log(process.env.CODEBUILD_WEBHOOK_MERGE_COMMIT);
console.log(process.env.CODEBUILD_WEBHOOK_PREV_COMMIT);
console.log(process.env.CODEBUILD_WEBHOOK_HEAD_REF);
console.log(process.env.CODEBUILD_WEBHOOK_TRIGGER);
console.log({
  env: process.env,
});
