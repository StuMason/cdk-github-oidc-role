import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import {
    GithubConstruct
} from '../lib/index';

test('Test Role and Policies Created', () => {
    const org = 'test-org';
    const repo = 'test-repo';

    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack");

    new GithubConstruct(stack, 'MyTestConstruct', {githubOrganisation: org, githubRepository: repo});   

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::IAM::Role', { 
        RoleName: `${org}-${repo}-deploy`
    });

    template.hasResourceProperties('AWS::IAM::Role', { 
        Policies: [{
            "PolicyDocument": {
                "Statement": [
                    {
                    "Action": "sts:AssumeRole",
                    "Effect": "Allow",
                    "Resource": Match.anyValue()
                    }
                ],
                "Version": "2012-10-17",
            },
            "PolicyName": "assumeCdk"
        }]
    });
});
