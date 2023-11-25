import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class Network extends Construct {
    readonly vpc: ec2.Vpc;
    readonly appRunnerSecurityGroup: ec2.SecurityGroup;
    readonly cacheSecurityGroup: ec2.SecurityGroup;

    // VPCとサブネットを作る
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.vpc = new ec2.Vpc(scope, 'VPC', {
            vpcName: 'myapp-vpc',
            cidr: '10.0.0.0/16',
            maxAzs: 2,
            subnetConfiguration: [
                // Redis用のサブネット
                {
                    cidrMask: 24,
                    name: 'myapp-cache',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                },
                // AppRunner用のサブネット
                {
                    cidrMask: 24,
                    name: 'myapp-Public',
                    subnetType: ec2.SubnetType.PUBLIC,
                }
            ],
            natGateways: 0,
        });

        // App Runnerに設定するセキュリティグループ
        this.appRunnerSecurityGroup = new ec2.SecurityGroup(scope, 'AppRunnerSecurityGroup', {
            vpc: this.vpc,
            description: 'for myapp-app-runner',
            securityGroupName: 'myapp-app-runner-sg'
        });

        //Cacheに設定するセキュリティグループ
        this.cacheSecurityGroup = new ec2.SecurityGroup(scope, 'CacheSecurityGroup', {
            vpc: this.vpc,
            description: 'for myapp-cache',
            securityGroupName: 'myapp-cache-sg'
        });

        // App RunnerセキュリティグループからCacheセキュリティグループへのポート6379を許可
        this.cacheSecurityGroup.addIngressRule(this.appRunnerSecurityGroup, ec2.Port.tcp(6379));
    }
}
