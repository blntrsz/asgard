import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
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
import { App, AppProps, Stack } from "aws-cdk-lib";
import { Rule } from "aws-cdk-lib/aws-events";
import {
  getProjectName,
  getConnectionArn,
  getRepositoryName,
  getMainBranch,
} from "./utils/get-context";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { getPipelineConfig } from "./utils/get-pipeline-config";

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

    const { isDev, name } = getPipelineConfig(this);

    new Pipeline(this, name, {
      ...props,
      name,
      isDev,
    });
  }
}

const ACTION_NAME = "pipeline_pr_action";

class Pipeline extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: ApplicationProps & {
      isDev: boolean;
      name: string;
    },
  ) {
    super(scope, id);

    const isDev = props.isDev ?? false;
    const projectName = getProjectName(this);

    const role = new Role(this, "pipeline-role", {
      assumedBy: new ServicePrincipal("codebuild.amazonaws.com"),
    });

    role.addToPolicy(
      new PolicyStatement({
        actions: ["*"],
        resources: ["*"],
      }),
    );

    const rawPipeline = new CPipeline(this, "raw-pipeline", {
      pipelineType: PipelineType.V2,
      pipelineName: props.name,
      executionMode: isDev ? ExecutionMode.PARALLEL : ExecutionMode.SUPERSEDED,
      restartExecutionOnUpdate: true,
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
    }

    const synth = new CodeBuildStep("synth", {
      commands: props.commands,
      installCommands: props.installCommands,
      primaryOutputDirectory: "packages/app/cdk.out",
      input: CodePipelineSource.connection(
        getRepositoryName(this),
        getMainBranch(this),
        {
          actionName: ACTION_NAME,
          triggerOnPush: !isDev,
          codeBuildCloneOutput: true,
          connectionArn: getConnectionArn(this),
        },
      ),
      role,
    });

    const pipeline = new CodePipeline(this, "pipeline", {
      codePipeline: rawPipeline,
      selfMutation: true,
      synth,
    });

    pipeline.addStage(
      new Stage(this, projectName, {
        create: props.create,
        isDev: props.isDev,
      }),
    );
  }
}
