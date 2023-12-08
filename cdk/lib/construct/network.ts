import { Construct } from 'constructs';
import { IpAddresses, Port, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';

export class Network extends Construct {
  readonly vpc: Vpc;
  readonly appRunnerSecurityGroup: SecurityGroup;
  readonly cacheSecurityGroup: SecurityGroup;

  // VPCとサブネットを作る
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc = new Vpc(scope, 'VPC', {
      vpcName: 'myapp-vpc',
      ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 2,
      subnetConfiguration: [
        // AppRunner用のサブネット
        {
          cidrMask: 24,
          name: 'myapp-Public',
          subnetType: SubnetType.PUBLIC,
        },
        // Redis用のサブネット
        {
          cidrMask: 24,
          name: 'myapp-cache',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
      natGateways: 0,
    });

    // App Runnerに設定するセキュリティグループ
    this.appRunnerSecurityGroup = new SecurityGroup(
      scope,
      'AppRunnerSecurityGroup',
      {
        vpc: this.vpc,
        allowAllOutbound: false,
        description: 'for myapp-app-runner',
        securityGroupName: 'myapp-app-runner-sg',
      },
    );

    //Cacheに設定するセキュリティグループ
    this.cacheSecurityGroup = new SecurityGroup(scope, 'CacheSecurityGroup', {
      vpc: this.vpc,
      description: 'for myapp-cache',
      securityGroupName: 'myapp-cache-sg',
    });

    // AppRunnerセキュリティグループからCacheセキュリティグループへのポート6379を許可
    this.appRunnerSecurityGroup.addEgressRule(
      this.cacheSecurityGroup,
      Port.tcp(6379),
    );

    // CacheセキュリティグループにてAppRunnerセキュリティグループからポート6379の通信を許可
    this.cacheSecurityGroup.addIngressRule(
      this.appRunnerSecurityGroup,
      Port.tcp(6379),
    );
  }
}
