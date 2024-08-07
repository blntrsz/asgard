import { Construct } from "constructs";

function getContextParameter(scope: Construct, name: string) {
  const projectName: string | undefined = scope.node.tryGetContext(name);

  if (!projectName) {
    throw new Error(`Context parameter "${name}" not found`);
  }

  return projectName;
}

export const getProjectName = (scope: Construct): string => {
  return getContextParameter(scope, "projectName");
};

export const getRepositoryName = (scope: Construct): string => {
  return getContextParameter(scope, "repositoryName");
};

export const getMainBranch = (scope: Construct): string => {
  return getContextParameter(scope, "mainBranch");
};

export const getConnectionArn = (scope: Construct): string => {
  return getContextParameter(scope, "connectionArn");
};
