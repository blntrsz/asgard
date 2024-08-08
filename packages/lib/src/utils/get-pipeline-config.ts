import { Construct } from "constructs";
import { getProjectName } from "./get-context";
import { getScope } from "./get-scope";

export function getPipelineConfig(constructScope: Construct) {
  const projectName = getProjectName(constructScope);
  const initiator = process.env.CODEBUILD_INITIATOR;
  const devPipeline = `${projectName}-pipeline-dev`;
  const mainPipeline = `${projectName}-pipeline-main`;

  if (!initiator) {
    const scope = getScope(constructScope);

    return {
      name: scope === undefined ? mainPipeline : devPipeline,
      isDev: scope !== undefined,
    };
  }

  const codepipeline = initiator.replace("codepipeline/", "");

  if (codepipeline === devPipeline) {
    return {
      name: devPipeline,
      isDev: true,
    };
  }

  if (codepipeline === mainPipeline) {
    return {
      name: mainPipeline,
      isDev: false,
    };
  }

  throw new Error("Pipeline configuration is incorrect.");
}
