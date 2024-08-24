import { Stack, type StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const apiHandler = new NodejsFunction(this, 'api-lambda', {
      entry: join(__dirname, '../../../well-of-mimir-api/src/lambda.ts'),
      runtime: Runtime.NODEJS_20_X,
    });

    apiHandler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new LambdaRestApi(this, 'api', {
      handler: apiHandler,
    });
  }
}
