import { randomUUID } from 'node:crypto';

import { z } from '@hono/zod-openapi';
import { Task } from '@asgard/task-management';

export const taskSchema = z.object({
  name: z.string().openapi({ description: 'name of the task' }),
  description: z.string().openapi({ description: 'description of the task' }),
});

const dataSchema = z
  .object({
    id: z.string().openapi({
      description: 'The id of the Task.',
    }),
    type: z.string().openapi({
      description: 'Type of the Task',
    }),
    attributes: taskSchema,
  })
  .openapi('Task')
  .openapi({
    example: {
      id: randomUUID(),
      type: Task.type,
      attributes: {
        name: 'name',
        description: 'description',
      },
    },
  });

export const taskResponseSchema = z.object({
  data: dataSchema,
});
export type TaskResponseSchema = z.infer<typeof taskResponseSchema>;
export const tasksResponseSchema = z.object({
  links: z.object({
    prev: z.string().nullable(),
    next: z.string().nullable(),
  }),
  data: z.array(dataSchema),
});
export type TasksResponseSchema = z.infer<typeof tasksResponseSchema>;
