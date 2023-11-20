import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
/**
 * ElastiCacheへ接続するための情報
 */
export type CacheConnection = {
    /** Redis用のSecurityGroupのID */
    readonly securityGroupId: string;
    /** Redisのホスト名 */
    readonly host: string;
    /** Redisのポート番号 */
    readonly port: string;
}

/**
 * Redisなどのインフラを構築するスタック
 */
export class InfraStack extends cdk.Stack {
    /** VPC */
    readonly vpc: ec2.IVpc;
    /** ElastiCache */
    readonly cacheConnection: CacheConnection;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // VPCを作る
        this.vpc = new ec2.Vpc(this, 'Vpc', {
            natGateways: 1
        });
        // Redisを構築し、接続情報を保存する
        this.cacheConnection = this.cache();
    }

    /**
     * Redisを構築
     *
     * @returns 構築したRedisへ接続するための情報
     */
    private cache(): CacheConnection {
        // Redisに付与するセキュリティグループ
        const cacheSecurityGroup = new ec2.SecurityGroup(this, "CacheSecurityGroup", { vpc: this.vpc });
        // Redisが属するサブネット
        const subnetGroup = new elasticache.CfnSubnetGroup(this, "CacheSubnetGroup", {
            subnetIds: this.vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }).subnetIds,
            description: "Group of subnets to place Cache info",
        });

        // Redis構築
        const cacheCluster = new elasticache.CfnCacheCluster(this, "CacheCluster", {
            engine: "redis",
            cacheNodeType: "cache.t3.micro",
            numCacheNodes: 1,
            cacheSubnetGroupName: subnetGroup.ref,
            vpcSecurityGroupIds: [cacheSecurityGroup.securityGroupId],
        });

        // Redis接続情報を返す
        return {
            securityGroupId: cacheSecurityGroup.securityGroupId,
            host: cacheCluster.attrRedisEndpointAddress,
            port: cacheCluster.attrRedisEndpointPort,
        }
    }
}
