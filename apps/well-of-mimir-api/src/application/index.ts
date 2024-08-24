import { Hono } from 'hono';
import { HonoBindings } from './bindings';

const app = new Hono<HonoBindings>();

app.get('/', async (c) => {
  c.json({
    message: 'hello',
  });
});

app.get('/aws-lambda-info/', (c) => {
  return c.json({
    isBase64Encoded: c.env.event.isBase64Encoded,
    awsRequestId: c.env.lambdaContext.awsRequestId,
  });
});

export { app };
