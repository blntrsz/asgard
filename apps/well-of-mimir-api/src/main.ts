import { serve } from '@hono/node-server';
import { app } from './application';

serve(app, (addressInfo) => {
  console.log(`http://localhost:${addressInfo.port}`);
});
