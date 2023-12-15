import { Construct } from 'constructs';
import { Cache } from './constructs/cache';
import { Stack, StackProps } from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { CfnCacheCluster } from 'aws-cdk-lib/aws-elasticache';

export class CacheStack extends Stack {
  public readonly cacheCluster: CfnCacheCluster;

  constructor(scope: Construct, id: string, vpc: Vpc, cacheSecurityGroup: SecurityGroup, props?: StackProps) {
    super(scope, id, props);

    // Cacheを作成する
    this.cacheCluster = new Cache(this, 'ElastiCache', {
      vpc,
      cacheSecurityGroup,
    }).cacheCluster;
  }
}
