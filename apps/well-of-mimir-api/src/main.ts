import { serve } from '@hono/node-server';
import { app } from './application';

serve(
  {
    fetch: app.fetch,
  },
  (addressInfo) => {
    console.log(`http://localhost:${addressInfo.port}`);
  },
);
