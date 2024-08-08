import { execSync } from "child_process";
import { Construct } from "constructs";

export function getScope(scope?: Construct): number | undefined {
  const contextScope = scope ? scope.node.tryGetContext("scope") : undefined;

  if (contextScope) return Number(contextScope);
  if (!process.env.CODEBUILD_BUILD_ID) {
    // not running in codebuild
    return undefined;
  }

  const codeBuildID = process.env.CODEBUILD_BUILD_ID.split(":")[1];

  const codepipeline = process.env.CODEBUILD_INITIATOR!.replace(
    "codepipeline/",
    "",
  );

  const getActions = execSync(
    `aws codepipeline list-action-executions --pipeline-name ${codepipeline}`,
  ).toString();
  const actions = JSON.parse(getActions);

  const { pipelineExecutionId } = actions.actionExecutionDetails.find(
    (action: {
      output: { executionResult: { externalExecutionId: string | string[] } };
    }) =>
      action.output.executionResult.externalExecutionId.includes(codeBuildID),
  );

  const getExecution = execSync(
    `aws codepipeline get-pipeline-execution --pipeline-name ${codepipeline} --pipeline-execution-id ${pipelineExecutionId}`,
  ).toString();
  const execution = JSON.parse(getExecution);

  const pullRequestTrigger =
    execution?.pipelineExecution?.trigger?.triggerDetail;

  if (pullRequestTrigger.startsWith("arn")) return undefined;

  return JSON.parse(pullRequestTrigger).pullRequestId;
}
