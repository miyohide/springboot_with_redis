import { RemovalPolicy } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

export class EcrRepository extends Construct {
    readonly repository: ecr.Repository;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        // リポジトリを作成する
        this.repository = new ecr.Repository(scope, 'MyAppRepository', {
            repositoryName: 'myapp-repository',
            removalPolicy: RemovalPolicy.DESTROY,
            imageScanOnPush: false
        });
    }
}
