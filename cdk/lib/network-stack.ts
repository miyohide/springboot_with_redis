import { Construct } from 'constructs';
import { Network } from './constructs/network';
import { Stack, StackProps } from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';

export class NetworkStack extends Stack {
  public readonly vpc: Vpc;
  public readonly appRunnerSecurityGroup: SecurityGroup;
  public readonly cacheSecurityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // VPCを作成する
    const networkConstruct = new Network(
      this,
      'Network',
    );

    this.vpc = networkConstruct.vpc;
    this.appRunnerSecurityGroup = networkConstruct.appRunnerSecurityGroup;
    this.cacheSecurityGroup = networkConstruct.cacheSecurityGroup;
  }
}
