import { Construct } from "constructs";
import { getProjectName } from "./get-context";
import { getScope } from "./get-scope";

export function getPipelineConfig(constructScope: Construct) {
  const projectName = getProjectName(constructScope);
  const devPipeline = `${projectName}-pipeline-dev`;
  const mainPipeline = `${projectName}-pipeline-main`;

  const scope = getScope(constructScope);

  console.log({
    SCOPE: scope,
  });

  if (scope === "main") {
    return {
      name: mainPipeline,
      scope,
      isDev: false,
    };
  }

  return {
    name: devPipeline,
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
