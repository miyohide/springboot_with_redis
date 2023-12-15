import { Construct } from 'constructs';
import { Cache } from './constructs/cache';
import { Stack, StackProps } from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { CfnCacheCluster } from 'aws-cdk-lib/aws-elasticache';

interface CacheStackProps extends StackProps {
  vpc: Vpc;
  cacheSecurityGroup: SecurityGroup;
};

export class CacheStack extends Stack {
  public readonly cacheCluster: CfnCacheCluster;

  constructor(scope: Construct, id: string, props: CacheStackProps) {
    super(scope, id, props);

    // Cacheを作成する
    this.cacheCluster = new Cache(this, 'ElastiCache', {
      vpc: props.vpc,
      cacheSecurityGroup: props.cacheSecurityGroup,
    }).cacheCluster;
  }
}
