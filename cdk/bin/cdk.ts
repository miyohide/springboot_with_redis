#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { ContainerRepositoryStack } from '../lib/container-repository-stack';
import { CacheStack } from '../lib/cache-stack';
import { ComputeStack } from '../lib/compute-stack';

const app = new cdk.App();

// new CdkStack(app, 'CdkStack', {
// });

const networkStack = new NetworkStack(app, 'NetworkStack');
const ecrStack = new ContainerRepositoryStack(app, 'ContainerRepositoryStack');
const cacheStack = new CacheStack(app, 'CacheStack', {
    vpc: networkStack.vpc,
    cacheSecurityGroup: networkStack.cacheSecurityGroup
});

const computeStack = new ComputeStack(app, 'ComputeStack', {
    vpc: networkStack.vpc,
    repository: ecrStack.repository,
    appRunnerSecurityGroup: networkStack.appRunnerSecurityGroup,
    cacheCluster: cacheStack.cacheCluster
});

cacheStack.addDependency(networkStack);
computeStack.addDependency(networkStack);
computeStack.addDependency(ecrStack);
computeStack.addDependency(cacheStack);
