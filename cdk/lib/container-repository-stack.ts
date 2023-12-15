import { Construct } from 'constructs';
import { EcrRepository } from './constructs/ecr-repository';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-ecr';

export class ContainerRepositoryStack extends Stack {
  public readonly repository: Repository;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ECRを作成する
    this.repository = new EcrRepository(this, 'ECR').repository;
  }
}
