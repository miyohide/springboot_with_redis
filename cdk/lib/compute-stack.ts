import { Construct } from 'constructs';
import { AppRunner } from './constructs/app-runner';
import { Stack, StackProps } from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { CfnCacheCluster } from 'aws-cdk-lib/aws-elasticache';

interface ComputeStackProps extends StackProps {
  vpc: Vpc;
  repository: Repository;
  appRunnerSecurityGroup: SecurityGroup;
  cacheCluster: CfnCacheCluster;
};

export class ComputeStack extends Stack {
  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    // App Runnerを作成する
    new AppRunner(this, 'AppRunner', {
      vpc: props.vpc,
      repository: props.repository,
      appRunnerSecurityGroup: props.appRunnerSecurityGroup,
      cacheCluster: props.cacheCluster,
    });
  }
}
