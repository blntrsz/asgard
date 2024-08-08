import { Construct } from "constructs";
import { getProjectName } from "./get-context";
import { getScope } from "./get-scope";

export function getPipelineConfig(constructScope: Construct) {
  const projectName = getProjectName(constructScope);

  const scope = getScope(constructScope);

  if (scope === "main") {
    return {
      name: `${projectName}-pipeline-main`,
      scope: "main",
      isDev: false,
    };
  }

  return {
    name: `${projectName}-pipeline-dev`,
    scope,
    isDev: true,
  };
}

export enum RunningContext {
  LOCAL = "local",
  DEV_PIPELINE = "pev-pipeline",
  MAIN_PIPELINE = "main-pipeline",
}

export function getRunningContext() {
  const initiator = process.env.CODEBUILD_INITIATOR;

  if (!initiator) return RunningContext.LOCAL;

  const pipelineName = initiator.replace("codepipeline/", "");

  if (pipelineName.endsWith("main")) return RunningContext.MAIN_PIPELINE;

  return RunningContext.DEV_PIPELINE;
}
