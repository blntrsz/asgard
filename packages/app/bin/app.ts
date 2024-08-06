#!/usr/bin/env node
import "source-map-support/register";
import { AsgardApp } from "@asgard/lib";
import { ApiStack } from "../stacks/api-stack";
import { SpaStack } from "../stacks/spa-stack";
import { CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";

const synth = new ShellStep("synth", {
  primaryOutputDirectory: "packages/app/cdk.out",
  input: CodePipelineSource.connection("blntrsz/asgard", "main", {
    connectionArn:
      "arn:aws:codeconnections:eu-central-1:021891617269:connection/b8d174cd-4d30-4f76-835d-cf554eb319c9",
  }),
  installCommands: ["npm i -g pnpm", "pnpm i"],
  commands: ["cd ./packages/app/", "pnpm cdk synth"],
});

new AsgardApp({
  synth,
  create(scope) {
    new ApiStack(scope, "api-stack");
    new SpaStack(scope, "spa-stack");
  },
});
