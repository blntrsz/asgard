import { Construct } from "constructs";

export const getProjectName = (scope: Construct): string => {
  const projectName: string | undefined =
    scope.node.tryGetContext("projectName");

  if (!projectName) {
    throw new Error('Context parameter "projectName" not found');
  }

  return projectName;
};
