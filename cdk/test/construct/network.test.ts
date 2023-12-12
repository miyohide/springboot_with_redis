import { App } from 'aws-cdk-lib';
import { CdkStack } from '../../lib/cdk-stack';
import { Template } from 'aws-cdk-lib/assertions';

test('VPC and Subnets Created', () => {
  const app = new App();
  const stack = new CdkStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  // VPCが想定通りに作られていること
  template.resourceCountIs('AWS::EC2::VPC', 1);
  template.hasResourceProperties('AWS::EC2::VPC', {
    CidrBlock: '10.0.0.0/16',
  });

  // SubnetはAZごとに2つ、合計4つ作られていること
  template.resourceCountIs('AWS::EC2::Subnet', 4);
  template.hasResourceProperties('AWS::EC2::Subnet', {
    CidrBlock: '10.0.0.0/24',
    MapPublicIpOnLaunch: true,
  });
  template.hasResourceProperties('AWS::EC2::Subnet', {
    CidrBlock: '10.0.1.0/24',
    MapPublicIpOnLaunch: true,
  });
  template.hasResourceProperties('AWS::EC2::Subnet', {
    CidrBlock: '10.0.2.0/24',
    MapPublicIpOnLaunch: false,
  });
  template.hasResourceProperties('AWS::EC2::Subnet', {
    CidrBlock: '10.0.3.0/24',
    MapPublicIpOnLaunch: false,
  });

  // Security Group
  template.resourceCountIs('AWS::EC2::SecurityGroup', 2);
  template.hasResourceProperties('AWS::EC2::SecurityGroup', {
    GroupName: 'myapp-app-runner-sg',
  });
  template.hasResourceProperties('AWS::EC2::SecurityGroup', {
    GroupName: 'myapp-cache-sg',
  });

  // Security GroupのGroupIdを確認するために、AppRunnerに紐づいているSecurity GroupのIdを取得する
  const sgs = template.findResources('AWS::EC2::SecurityGroup', {
    Properties: { GroupName: 'myapp-app-runner-sg' },
  });
  const appRunnerSGId = Object.keys(sgs)[0];

  // Security Groupの入力設定
  template.resourceCountIs('AWS::EC2::SecurityGroupIngress', 1);
  template.hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
    IpProtocol: 'tcp',
    FromPort: 6379,
    ToPort: 6379,
    SourceSecurityGroupId: { 'Fn::GetAtt': [appRunnerSGId, 'GroupId'] },
  });

  // Security Groupの出力設定
  template.resourceCountIs('AWS::EC2::SecurityGroupEgress', 1);
  template.hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
    IpProtocol: 'tcp',
    FromPort: 6379,
    ToPort: 6379,
  });
});
