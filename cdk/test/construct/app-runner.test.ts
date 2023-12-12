import { App } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { CdkStack } from "../../lib/cdk-stack";

test('VPC and Subnets Created', () => {
  const app = new App();
  const stack = new CdkStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::AppRunner::Service', 1);
  template.hasResourceProperties('AWS::AppRunner::Service', {
    NetworkConfiguration: Match.objectLike({
      EgressConfiguration: Match.objectLike({
        EgressType: 'VPC'
      }),
    }),
  });
});
