import { handle } from 'hono/aws-lambda';
import { app } from './application';

export const handler = handle(app);
