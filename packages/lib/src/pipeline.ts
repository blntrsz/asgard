import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import {
  PipelineType,
  Pipeline as CPipeline,
  ExecutionMode,
  ProviderType,
  GitPullRequestEvent,
  ActionCategory,
} from "aws-cdk-lib/aws-codepipeline";
import { Construct } from "constructs";
import { Stage, StageProps } from "./stage";
import { App, AppProps, Stack, StackProps } from "aws-cdk-lib";
import { Rule } from "aws-cdk-lib/aws-events";
import {
  getProjectName,
  getConnectionArn,
  getRepositoryName,
  getMainBranch,
} from "./utils/get-context";

/**
 * Props fro the Asgard Application
 */
export type ApplicationProps = {
  create: StageProps["create"];
  installCommands: string[];
  commands: string[];
};

/**
 * An Instance of an Asgard application. Use as the main entry point for the CDK App, as the bin.
 */
export class AsgardApp extends App {
  constructor(props: AppProps & ApplicationProps) {
    super(props);

    const projectName = getProjectName(this);

    new Pipelines(this, `${projectName}-pipeline`, props);
  }
}

const ACTION_NAME = "pipeline_pr_action";

export class Pipelines extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: ApplicationProps & StackProps,
  ) {
    super(scope, id, props);

    new Pipeline(this, "main-pipeline", props);
    new Pipeline(this, "dev-pipeline", {
      ...props,
      isDev: true,
    });
  }
}

class Pipeline extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: ApplicationProps & {
      isDev?: boolean;
    },
  ) {
    super(scope, id);

    const isDev = props.isDev ?? false;
    const projectName = getProjectName(this);

    const rawPipeline = new CPipeline(this, "raw-pipeline", {
      pipelineType: PipelineType.V2,
      pipelineName: `${projectName}-pipeline-${isDev ? "dev" : "main"}`,
      executionMode: ExecutionMode.PARALLEL,
    });

    if (isDev) {
      rawPipeline.addTrigger({
        providerType: ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction: {
            actionProperties: {
              artifactBounds: {
                minOutputs: 0,
                maxOutputs: 1,
                minInputs: 0,
                maxInputs: 1,
              },
              category: ActionCategory.BUILD,
              provider: "CodeStarSourceConnection",
              actionName: ACTION_NAME,
            },
            bind() {
              return {};
            },
            onStateChange() {
              return new Rule(this, "rule");
            },
          },
          pullRequestFilter: [
            {
              branchesIncludes: ["*"],
              events: [GitPullRequestEvent.OPEN, GitPullRequestEvent.UPDATED],
            },
          ],
        },
      });
    } else {
      rawPipeline.addTrigger({
        providerType: ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction: {
            actionProperties: {
              artifactBounds: {
                minOutputs: 0,
                maxOutputs: 1,
                minInputs: 0,
                maxInputs: 1,
              },
              category: ActionCategory.BUILD,
              provider: "CodeStarSourceConnection",
              actionName: ACTION_NAME,
            },
            bind() {
              return {};
            },
            onStateChange() {
              return new Rule(this, "rule");
            },
          },
          pushFilter: [
            {
              tagsIncludes: ["*"],
            },
          ],
        },
      });
    }

    const pipeline = new CodePipeline(this, "pipeline", {
      codePipeline: rawPipeline,
      selfMutation: true,
      synth: new ShellStep("synth", {
        primaryOutputDirectory: "packages/app/cdk.out",
        input: CodePipelineSource.connection(
          getRepositoryName(this),
          getMainBranch(this),
          {
            actionName: ACTION_NAME,
            triggerOnPush: true,
            connectionArn: getConnectionArn(this),
          },
        ),
        installCommands: props.installCommands,
        commands: props.commands,
      }),
    });

    pipeline.addStage(
      new Stage(this, projectName, {
        create: props.create,
      }),
    );
  }
}
