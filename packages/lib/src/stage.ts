import { Stage as CDKStage } from "aws-cdk-lib";
import { Construct } from "constructs";

interface StageProps {
  create(scope: Construct): void;
}

export class Stage extends CDKStage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id);

    props.create(this);
  }
}
