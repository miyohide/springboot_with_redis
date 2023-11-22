import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as apprunner from 'aws-cdk-lib/aws-apprunner';
import { CacheConnection } from './infra-stack';

export class ServiceStack extends cdk.Stack {
    constructor(scope: Construct, id: string, vpc: ec2.IVpc, cacheConnection: CacheConnection, props?: cdk.StackProps) {
        super(scope, id, props);

        // App Runnerのセキュリティグループ
        const vpcConnectionSecurityGroup = new ec2.SecurityGroup(this, "SecurityGroup", { vpc });

        // App RunnerがElastiCacheへ接続できるようにセキュリティグループを設定
        const cacheSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
            this, "CacheSecurityGroup", cacheConnection.securityGroupId, {}
        );
        cacheSecurityGroup.addIngressRule(
            vpcConnectionSecurityGroup, ec2.Port.tcp(6379), "Ingress to the cache"
        );

        // VPC Connectorを作成
        const connector = new apprunner.CfnVpcConnector(this, 'VpcConnector', {
            subnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }).subnetIds,
            securityGroups: [ vpcConnectionSecurityGroup.securityGroupId ],
        });

        // App Runnerサービスを作成
        const service = new apprunner.CfnService(this, 'Service', {
            sourceConfiguration: {
                authenticationConfiguration: {
                    connectionArn: this.node.tryGetContext('connectionArn'),
                },
                codeRepository: {
                    repositoryUrl: this.node.tryGetContext('repositoryUrl'),
                    sourceCodeVersion: {
                        type: "BRANCH",
                        value: "main",
                    },
                    codeConfiguration: {
                        configurationSource: "API",
                        codeConfigurationValues: {
                            runtime: "CORRETTO_17",
                            buildCommand: "./gradlew bootJar && cp build/libs/*.jar ./",
                            startCommand: "java -jar ./expt-apprunner-springboot.jar",
                            runtimeEnvironmentVariables: [
                                {
                                    name: "CACHE_HOST",
                                    value: cacheConnection.host,
                                },
                                {
                                    name: "CACHE_PORT",
                                    value: cacheConnection.port,
                                },
                            ],
                        },
                    },
                },
            },
            networkConfiguration: {
                egressConfiguration: {
                    egressType: "VPC",
                    vpcConnectorArn: connector.attrVpcConnectorArn,
                },
            },
        });
        new cdk.CfnOutput(this, 'AppRunnerServiceURL', {
            value: service.attrServiceUrl,
        });
    }
}
