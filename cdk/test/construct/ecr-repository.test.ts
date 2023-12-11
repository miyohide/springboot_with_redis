import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CdkStack } from "../../lib/cdk-stack";

test('VPC and Subnets Created', () => {
  const app = new App();
  const stack = new CdkStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::ECR::Repository', 1);
  template.hasResourceProperties('AWS::ECR::Repository', {
    RepositoryName: 'myapp-repository'
  });
});