import { CodePipeline, ShellStep } from "aws-cdk-lib/pipelines";
import {
  PipelineType,
  Pipeline as CPipeline,
} from "aws-cdk-lib/aws-codepipeline";
import { Construct } from "constructs";
import { Stage } from "./stage";
import { App, AppProps, Stack, StackProps } from "aws-cdk-lib";

export type ApplicationProps = {
  create(scope: Construct): void;
  synth: ShellStep;
};

export type PipelineProps = ApplicationProps & StackProps;

export class Pipeline extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

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

    pipeline.addStage(
      new Stage(this, "stage", {
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
