import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { HonoBindings } from '../../bindings';
import {
  Task,
  SlonikTaskRepository,
  CreateTask,
} from '@asgard/task-management';
import { EventBridgeEventEmitter, PinoLogger } from '@asgard/common';
import { taskResponseSchema, taskSchema } from './task-schema';

const route = createRoute({
  method: 'post',
  path: `/`,
  tags: [Task.type],
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: taskSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: taskResponseSchema,
        },
      },
      description: 'Retrieve the tasks paginated',
    },
  },
});

export const createTask = new OpenAPIHono<HonoBindings>().openapi(
  route,
  async (c) => {
    const body = c.req.valid('json') as { name: string; description: string };
    const createTaskUseCase = new CreateTask(
      new PinoLogger(),
      new SlonikTaskRepository(),
      new EventBridgeEventEmitter(),
    );
    await createTaskUseCase.execute(body);

    return c.json(
      {
        data: {},
      },
      200,
    );
  },
);
