import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Network } from './construct/network';
import { EcrRepository } from './construct/ecr-repository';
import { Cache } from './construct/cache';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPCを作成する
    const { vpc, appRunnerSecurityGroup, cacheSecurityGroup } = new Network(this, 'Network');

    // ECRを作成する
    const { repository } = new EcrRepository(this, 'Ecr');

    // Cacheを作成する
    const { cacheCluster } = new Cache(this, 'ElastiCache', { vpc, cacheSecurityGroup });
  }
}
