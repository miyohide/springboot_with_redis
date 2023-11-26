import { aws_elasticache } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';

interface CacheProps {
    vpc: ec2.Vpc
    cacheSecurityGroup: ec2.SecurityGroup
}

export class Cache extends Construct {
    readonly cacheCluster: elasticache.CfnCacheCluster;

    constructor(scope: Construct, id: string, props: CacheProps) {
        super(scope, id);

        const { vpc, cacheSecurityGroup } = props;

        const cacheSubnetGroup =  new elasticache.CfnSubnetGroup(this, "CacheSubnetGroup", {
            subnetIds: vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }).subnetIds,
            description: "Group of subnets to place Cache into",
        });

        this.cacheCluster = new elasticache.CfnCacheCluster(this, "CacheCluster", {
            engine: "redis",
            cacheNodeType: "cache.t3.micro",
            numCacheNodes: 1,
            cacheSubnetGroupName: cacheSubnetGroup.ref,
            vpcSecurityGroupIds: [cacheSecurityGroup.securityGroupId],
        });
    }
}