import { App } from 'aws-cdk-lib';
import { CdkStack } from '../../lib/cdk-stack';
import { Match, Template } from 'aws-cdk-lib/assertions';

describe('test of cdk-stack', () => {
  let template: Template;

// テストの確認対象となるスタックテンプレートを生成
beforeAll(() => {
    const app = new App();
    const stack = new CdkStack(app, 'MyTestStack');
    template = Template.fromStack(stack);
  });

  test('VPC and Subnets Created', () => {
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

  test('ECR Repository Created', () => {
    template.resourceCountIs('AWS::ECR::Repository', 1);
    template.hasResourceProperties('AWS::ECR::Repository', {
      RepositoryName: 'myapp-repository'
    });
  });

  test('ElastiCache Created', () => {
    template.resourceCountIs('AWS::ElastiCache::CacheCluster', 1);
    template.hasResourceProperties('AWS::ElastiCache::CacheCluster', {
      Engine: 'redis',
    })

    template.resourceCountIs('AWS::ElastiCache::SubnetGroup', 1);
  });

  test('VPC and Subnets Created', () => {
    template.resourceCountIs('AWS::AppRunner::Service', 1);
    template.hasResourceProperties('AWS::AppRunner::Service', {
      NetworkConfiguration: Match.objectLike({
        EgressConfiguration: Match.objectLike({
          EgressType: 'VPC'
        }),
      }),
    });
  });
});
