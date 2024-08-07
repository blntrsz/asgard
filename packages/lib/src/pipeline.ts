import { CodePipeline, ShellStep } from "aws-cdk-lib/pipelines";
import {
  PipelineType,
  Pipeline as CPipeline,
  ExecutionMode,
} from "aws-cdk-lib/aws-codepipeline";
import { Construct } from "constructs";
import { Stage, StageProps } from "./stage";
import { App, AppProps, Stack, StackProps } from "aws-cdk-lib";
import { getProjectName } from "./utils/get-project-name";

export type ApplicationProps = {
  create: StageProps["create"];
  synth: ShellStep;
};

export type PipelineProps = ApplicationProps & StackProps;

export class Pipeline extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    const projectName = getProjectName(this);

    const rawPipeline = new CPipeline(this, "raw-pipeline", {
      pipelineType: PipelineType.V2,
      pipelineName: `${projectName}-pipeline`,
      executionMode: ExecutionMode.PARALLEL,
    });

    const pipeline = new CodePipeline(this, "pipeline", {
      codePipeline: rawPipeline,
      selfMutation: true,
      synth: props.synth,
    });

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
