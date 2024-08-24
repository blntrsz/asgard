import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { HonoBindings } from './bindings';
import { createTask } from './routes/task/create-task';
import { Task } from '@asgard/task-management';

const app = new OpenAPIHono<HonoBindings>();

app.doc('/openapi', {
  openapi: '3.0.0',
  info: {
    version: '0.0.1',
    title: 'Well of Mimir API',
  },
});
app.get('/swagger', swaggerUI({ url: '/openapi' }));
app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

const route = app.route(`/${Task.type}`, createTask);

export { app };
export type AppType = typeof route;
