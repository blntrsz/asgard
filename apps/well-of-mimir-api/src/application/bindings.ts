import { LambdaContext, LambdaEvent } from 'hono/aws-lambda';

type Bindings = {
  event: LambdaEvent;
  lambdaContext: LambdaContext;
};

export type HonoBindings = { Bindings: Bindings };
