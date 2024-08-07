#!/usr/bin/env node
import "source-map-support/register";
import { AsgardApp } from "@asgard/lib";
import { ApiStack } from "../stacks/api-stack";
import { SpaStack } from "../stacks/spa-stack";

new AsgardApp({
  installCommands: ["npm i -g pnpm", "pnpm i"],
  commands: ["cd ./packages/app/", "pnpm cdk synth"],
  create(scope) {
    new ApiStack(scope, "api-stack");
    new SpaStack(scope, "spa-stack");
  },
});
