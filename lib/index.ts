import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface GithubConstructProps {
  // Define construct properties here
}

export class GithubConstruct extends Construct {

  constructor(scope: Construct, id: string, props: GithubConstructProps = {}) {
    super(scope, id);

    // Define construct contents here

    // example resource
    // const queue = new sqs.Queue(this, 'GithubConstructQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
