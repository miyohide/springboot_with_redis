import { Construct } from 'constructs';
import { AppRunner } from './constructs/app-runner';
import { Stack, StackProps } from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { CfnCacheCluster } from 'aws-cdk-lib/aws-elasticache';

export class ComputeStack extends Stack {
  constructor(scope: Construct, id: string, vpc: Vpc, repository: Repository, appRunnerSecurityGroup: SecurityGroup, cacheCluster: CfnCacheCluster,  props?: StackProps) {
    super(scope, id, props);

    // App Runnerを作成する
    new AppRunner(this, 'AppRunner', {
      vpc,
      repository,
      appRunnerSecurityGroup,
      cacheCluster,
    });
  }
}
