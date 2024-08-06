import { CodePipeline, ShellStep } from "aws-cdk-lib/pipelines";
import {
  PipelineType,
  Pipeline as CPipeline,
} from "aws-cdk-lib/aws-codepipeline";
import { Construct } from "constructs";
import { Stage, StageProps } from "./stage";
import { App, AppProps, Stack, StackProps } from "aws-cdk-lib";
import { getProjectName } from "./utils/get-project-name";
import { Queue } from "aws-cdk-lib/aws-sqs";

export type ApplicationProps = {
  create: StageProps["create"];
  synth: ShellStep;
};

export type PipelineProps = ApplicationProps & StackProps;

export class Pipeline extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    new Queue(this, "global-dlq");

    const rawPipeline = new CPipeline(this, "raw-pipeline", {
      pipelineType: PipelineType.V2,
      // triggers: [
      //   {
      //     gitConfiguration: {
      //       sourceAction: {
      //         actionProperties
      //       }
      //     },
      //   },
      // ],
    });

    const pipeline = new CodePipeline(this, "pipeline", {
      codePipeline: rawPipeline,
      selfMutation: true,
      synth: props.synth,
    });

    const projectName = getProjectName(this);

    pipeline.addStage(
      new Stage(this, projectName, {
        create: props.create,
      }),
    );
  }
}

export class AsgardApp extends App {
  constructor(props: AppProps & ApplicationProps) {
    super(props);

    new Pipeline(this, "pipeline", props);
  }
}
