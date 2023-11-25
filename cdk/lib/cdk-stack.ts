import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Network } from './construct/network';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { vpc, appRunnerSecurityGroup, cacheSecurityGroup } = new Network(this, 'Network');
  }
}
