import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { CfnCacheCluster, CfnSubnetGroup } from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';

interface CacheProps {
    vpc: Vpc
    cacheSecurityGroup: SecurityGroup
}

export class Cache extends Construct {
    readonly cacheCluster: CfnCacheCluster;

    constructor(scope: Construct, id: string, props: CacheProps) {
        super(scope, id);

        const { vpc, cacheSecurityGroup } = props;

        const cacheSubnetGroup =  new CfnSubnetGroup(this, "CacheSubnetGroup", {
            subnetIds: vpc.selectSubnets({ subnetType: SubnetType.PRIVATE_WITH_EGRESS }).subnetIds,
            description: "Group of subnets to place Cache into",
        });

        this.cacheCluster = new CfnCacheCluster(this, "CacheCluster", {
            engine: "redis",
            cacheNodeType: "cache.t3.micro",
            numCacheNodes: 1,
            cacheSubnetGroupName: cacheSubnetGroup.ref,
            vpcSecurityGroupIds: [cacheSecurityGroup.securityGroupId],
        });
    }
}