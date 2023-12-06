import { RemovalPolicy } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

export class EcrRepository extends Construct {
    readonly repository: Repository;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        // リポジトリを作成する
        this.repository = new Repository(scope, 'MyAppRepository', {
            repositoryName: 'myapp-repository',
            removalPolicy: RemovalPolicy.DESTROY,
            imageScanOnPush: false
        });
    }
}
