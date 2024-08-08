#!/usr/bin/env node
import "source-map-support/register";
import { AsgardApp } from "@asgard/lib";
import { ApiStack } from "../stacks/api-stack";
import { SpaStack } from "../stacks/spa-stack";

new AsgardApp({
  installCommands: ["npm i -g pnpm", "pnpm i"],
  commands: ["cd ./packages/app/", "pnpm cdk synth"],
  create(scope, getScopedName) {
    new ApiStack(scope, "api", {
      stackName: getScopedName("api"),
    });
    new SpaStack(scope, "spa", {
      stackName: getScopedName("spa"),
    });
  },
});
