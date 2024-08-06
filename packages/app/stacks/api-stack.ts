import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Queue } from "aws-cdk-lib/aws-sqs";

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Queue(this, "queue");
  }
}
