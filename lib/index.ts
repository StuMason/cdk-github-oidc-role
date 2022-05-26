import { Construct } from 'constructs';
import {
  Stack,
  CfnOutput,
  aws_iam as iam,
} from 'aws-cdk-lib';

export interface GithubConstructProps {
  readonly githubOrganisation: string;
  readonly githubRepository: string;
}

export class GithubConstruct extends Construct {

  constructor(scope: Construct, id: string, props: GithubConstructProps) {
    super(scope, id);

    const openIdConnectProviderArn = `arn:aws:iam::${Stack.of(this).account}:oidc-provider/token.actions.githubusercontent.com`;

    const provider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(this, 'GithubProvider', openIdConnectProviderArn);

    const principle = new iam.OpenIdConnectPrincipal(provider).withConditions(
      {"StringLike": {
          "token.actions.githubusercontent.com": `repo:${props.githubOrganisation}:${props.githubRepository}`
      }}
    );

    principle.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sts:AssumeRoleWithWebIdentity'],
      resources: ['*'],
    }));

    const assumeCdkPolicy = new iam.PolicyDocument({
      statements: [ 
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['sts:AssumeRole'],
          resources: [`arn:aws:iam::${Stack.of(this).account}:role/cdk-*`],
      })],
    })

    const role = new iam.Role(this, 'GithubDeploymentRole', {
      assumedBy: principle,
      roleName: `${props.githubOrganisation}-${props.githubRepository}-deploy`,
      description: `Deploy from ${props.githubOrganisation}/${props.githubRepository}`,
      inlinePolicies: {"assumeCdk": assumeCdkPolicy}
    });

    new CfnOutput(this, 'GithubDeploymentRoleArn', { value: role.roleArn });
  }
}
