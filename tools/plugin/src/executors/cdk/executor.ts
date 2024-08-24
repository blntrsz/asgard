import { PromiseExecutor } from '@nx/devkit';
import { CdkExecutorSchema } from './schema';
import { execSync } from 'child_process';
import { z } from 'zod';
import { join } from 'path';

const runExecutor: PromiseExecutor<CdkExecutorSchema> = async (
  options,
  context,
) => {
  const args = z.array(z.string()).parse(options['_']);
  const command = `npx cdk ${args.join(' ')}`;
  const cwd = join(
    context.root,
    context.projectGraph.nodes[context.projectName].data.root,
  );

  execSync(command, {
    stdio: 'inherit',
    cwd,
  });

  return {
    success: true,
  };
};

export default runExecutor;
