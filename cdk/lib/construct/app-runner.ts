import * as apprunner from 'aws-cdk-lib/aws-apprunner';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import { Construct } from "constructs";

interface AppRunnerProps {
    vpc: ec2.Vpc,
    repository: ecr.Repository,
    appRunnerSecurityGroup: ec2.SecurityGroup,
    // cacheCluster: elasticache.CfnCacheCluster,
}

export class AppRunner extends Construct {
    constructor(scope: Construct, id: string, props: AppRunnerProps) {
        super(scope, id);

        // const { vpc, repository, appRunnerSecurityGroup, cacheCluster } = props;
        const { vpc, repository, appRunnerSecurityGroup } = props;

        // Roleの作成（ECRに接続するため）
        const accessRole = new iam.Role(scope, 'AppRunnerAccessRole', {
            roleName: 'myapp-AppRunnerAccessRole',
            assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
        });

        accessRole.addManagedPolicy(
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppRunnerServicePolicyForECRAccess'),
        );

        // VPC Connectorの作成
        // const vpcConnector = new apprunner.CfnVpcConnector(scope, 'MyAppVPCConnector', {
        //     subnets: vpc.selectSubnets({
        //         subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
        //     }).subnetIds,
        //     securityGroups: [appRunnerSecurityGroup.securityGroupId]
        // })

        const service = new apprunner.CfnService(this, 'AppRunnerService', {
            sourceConfiguration: {
                authenticationConfiguration: {
                    accessRoleArn: accessRole.roleArn,
                },
                autoDeploymentsEnabled: true,
                imageRepository: {
                    imageIdentifier: `${repository.repositoryUri}:latest`,
                    imageRepositoryType: 'ECR',
                    imageConfiguration: {
                        port: '8080',
                        // runtimeEnvironmentVariables: [
                        //     {
                        //         name: 'REDIS_HOST',
                        //         value: cacheCluster.attrRedisEndpointAddress
                        //     },
                        //     {
                        //         name: 'REDIS_PORT',
                        //         value: cacheCluster.attrRedisEndpointPort
                        //     },
                        // ],
                    },
                },
            },
            // networkConfiguration: {
            //     egressConfiguration: {
            //         egressType: 'VPC',
            //         vpcConnectorArn: vpcConnector.attrVpcConnectorArn,
            //     },
            // },
        });
    }
}
