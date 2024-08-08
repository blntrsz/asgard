import { Construct } from "constructs";
import { getProjectName } from "./get-context";
import { getScope } from "./get-scope";

export function getPipelineConfig(constructScope: Construct) {
  const projectName = getProjectName(constructScope);
  const devPipeline = `${projectName}-pipeline-dev`;
  const mainPipeline = `${projectName}-pipeline-main`;

  const scope = getScope(constructScope);

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
