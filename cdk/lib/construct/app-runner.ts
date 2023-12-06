import { Construct } from "constructs";
import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { CfnCacheCluster } from 'aws-cdk-lib/aws-elasticache';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnService, CfnVpcConnector } from "aws-cdk-lib/aws-apprunner";

interface AppRunnerProps {
    vpc: Vpc,
    repository: Repository,
    appRunnerSecurityGroup: SecurityGroup,
    cacheCluster: CfnCacheCluster,
}

export class AppRunner extends Construct {
    constructor(scope: Construct, id: string, props: AppRunnerProps) {
        super(scope, id);

        const { vpc, repository, appRunnerSecurityGroup, cacheCluster } = props;

        // Roleの作成（ECRに接続するため）
        const accessRole = new Role(scope, 'AppRunnerAccessRole', {
            roleName: 'myapp-AppRunnerAccessRole',
            assumedBy: new ServicePrincipal('build.apprunner.amazonaws.com'),
        });

        accessRole.addManagedPolicy(
            ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppRunnerServicePolicyForECRAccess'),
        );

        // VPC Connectorの作成
        const vpcConnector = new CfnVpcConnector(scope, 'MyAppVPCConnector', {
            subnets: vpc.selectSubnets({
                subnetType: SubnetType.PRIVATE_WITH_EGRESS
            }).subnetIds,
            securityGroups: [appRunnerSecurityGroup.securityGroupId]
        })

        const service = new CfnService(this, 'AppRunnerService', {
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
                        runtimeEnvironmentVariables: [
                            {
                                name: 'REDIS_HOST',
                                value: cacheCluster.attrRedisEndpointAddress
                            },
                            {
                                name: 'REDIS_PORT',
                                value: cacheCluster.attrRedisEndpointPort
                            },
                        ],
                    },
                },
            },
            networkConfiguration: {
                egressConfiguration: {
                    egressType: 'VPC',
                    vpcConnectorArn: vpcConnector.attrVpcConnectorArn,
                },
            },
        });
    }
}
