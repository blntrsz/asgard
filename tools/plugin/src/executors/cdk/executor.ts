import { PromiseExecutor } from '@nx/devkit';
import { CdkExecutorSchema } from './schema';
import { execSync } from 'child_process';
import { z } from 'zod';

const runExecutor: PromiseExecutor<CdkExecutorSchema> = async (
  options,
  context,
) => {
  const args = z.array(z.string()).parse(options['_']);
  const command = `npx cdk ${args.join(' ')}`;

  execSync(command, {
    stdio: 'inherit',
    cwd: context.projectGraph.nodes[context.projectName].data.root,
  });

  return {
    success: true,
  };
};

export default runExecutor;
