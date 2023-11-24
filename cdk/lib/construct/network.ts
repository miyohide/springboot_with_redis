import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class Network extends Construct {
    readonly vpc: ec2.Vpc;

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
            natGateways: 1,
        });
    }
}