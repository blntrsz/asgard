import { Construct } from "constructs";
import { getProjectName } from "./get-context";
import { getScope } from "./get-scope";

export function getPipelineConfig(constructScope: Construct) {
  const projectName = getProjectName(constructScope);
  const devPipeline = `${projectName}-pipeline-dev`;
  const mainPipeline = `${projectName}-pipeline-main`;

  const scope = getScope(constructScope);

  if (scope) {
    return {
      name: scope === undefined ? mainPipeline : devPipeline,
      scope: `pr-${scope}`,
      isDev: scope !== undefined,
    };
  }

  return {
    name: mainPipeline,
    scope: "main",
    isDev: false,
  };
}
