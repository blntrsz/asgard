import { Stage as CDKStage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getScope } from "./utils/get-scope";
import { getProjectName } from "./utils/get-context";

export interface StageProps {
  create(construct: Construct, getScopedName: (name: string) => string): void;
}

export class Stage extends CDKStage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id);

    const envName = getScope(this);
    console.log({
      SCOPE: envName,
    });
    const projectName = getProjectName(this);

    function getScopedName(name: string) {
      return `${projectName}-${name}-${envName}`;
    }

    props.create(this, getScopedName);
  }
}
