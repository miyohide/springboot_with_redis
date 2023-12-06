import { Construct } from 'constructs';
import { Network } from './construct/network';
import { EcrRepository } from './construct/ecr-repository';
import { Cache } from './construct/cache';
import { AppRunner } from './construct/app-runner';
import { Stack, StackProps } from 'aws-cdk-lib';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // VPCを作成する
    const { vpc, appRunnerSecurityGroup, cacheSecurityGroup } = new Network(this, 'Network');

    // ECRを作成する
    const { repository } = new EcrRepository(this, 'Ecr');

    // Cacheを作成する
    const { cacheCluster } = new Cache(this, 'ElastiCache', { vpc, cacheSecurityGroup });

    // App Runnerを作成する
    new AppRunner(this, 'AppRunner', { vpc, repository, appRunnerSecurityGroup, cacheCluster });
  }
}
