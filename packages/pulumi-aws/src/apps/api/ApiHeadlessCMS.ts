import path from "path";
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import { defineAppModule, PulumiApp, PulumiAppModule } from "@webiny/pulumi-sdk";

import { createLambdaRole, getCommonLambdaEnvVariables } from "../lambdaUtils";
import { StorageOutput, VpcConfig } from "../common";

interface HeadlessCMSParams {
    env: Record<string, any>;
}

export type ApiHeadlessCMS = PulumiAppModule<typeof ApiHeadlessCMS>;

export const ApiHeadlessCMS = defineAppModule({
    name: "ApiHeadlessCMS",
    config(app: PulumiApp, params: HeadlessCMSParams) {
        const policy = createHeadlessCmsLambdaPolicy(app);
        const role = createLambdaRole(app, {
            name: "headless-cms-lambda-role",
            policy: policy.output
        });

        const graphql = app.addResource(aws.lambda.Function, {
            name: "headless-cms",
            config: {
                runtime: "nodejs14.x",
                handler: "handler.handler",
                role: role.output.arn,
                timeout: 30,
                memorySize: 512,
                code: new pulumi.asset.AssetArchive({
                    ".": new pulumi.asset.FileArchive(
                        path.join(app.ctx.appDir, "code/headlessCMS/build")
                    )
                }),
                environment: {
                    variables: {
                        ...getCommonLambdaEnvVariables(app),
                        ...params.env,
                        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1"
                    }
                },
                vpcConfig: app.getModule(VpcConfig).functionVpcConfig
            }
        });

        return {
            role,
            policy,
            functions: {
                graphql
            }
        };
    }
});

function createHeadlessCmsLambdaPolicy(app: PulumiApp) {
    const storage = app.getModule(StorageOutput);

    return app.addResource(aws.iam.Policy, {
        name: "HeadlessCmsLambdaPolicy",
        config: {
            description: "This policy enables access to Dynamodb streams",
            policy: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Sid: "PermissionDynamodb",
                        Effect: "Allow",
                        Action: [
                            "dynamodb:BatchGetItem",
                            "dynamodb:BatchWriteItem",
                            "dynamodb:ConditionCheckItem",
                            "dynamodb:CreateBackup",
                            "dynamodb:CreateTable",
                            "dynamodb:CreateTableReplica",
                            "dynamodb:DeleteBackup",
                            "dynamodb:DeleteItem",
                            "dynamodb:DeleteTable",
                            "dynamodb:DeleteTableReplica",
                            "dynamodb:DescribeBackup",
                            "dynamodb:DescribeContinuousBackups",
                            "dynamodb:DescribeContributorInsights",
                            "dynamodb:DescribeExport",
                            "dynamodb:DescribeKinesisStreamingDestination",
                            "dynamodb:DescribeLimits",
                            "dynamodb:DescribeReservedCapacity",
                            "dynamodb:DescribeReservedCapacityOfferings",
                            "dynamodb:DescribeStream",
                            "dynamodb:DescribeTable",
                            "dynamodb:DescribeTableReplicaAutoScaling",
                            "dynamodb:DescribeTimeToLive",
                            "dynamodb:DisableKinesisStreamingDestination",
                            "dynamodb:EnableKinesisStreamingDestination",
                            "dynamodb:ExportTableToPointInTime",
                            "dynamodb:GetItem",
                            "dynamodb:GetRecords",
                            "dynamodb:GetShardIterator",
                            "dynamodb:ListBackups",
                            "dynamodb:ListContributorInsights",
                            "dynamodb:ListExports",
                            "dynamodb:ListStreams",
                            "dynamodb:ListTables",
                            "dynamodb:ListTagsOfResource",
                            "dynamodb:PartiQLDelete",
                            "dynamodb:PartiQLInsert",
                            "dynamodb:PartiQLSelect",
                            "dynamodb:PartiQLUpdate",
                            "dynamodb:PurchaseReservedCapacityOfferings",
                            "dynamodb:PutItem",
                            "dynamodb:Query",
                            "dynamodb:RestoreTableFromBackup",
                            "dynamodb:RestoreTableToPointInTime",
                            "dynamodb:Scan",
                            "dynamodb:UpdateContinuousBackups",
                            "dynamodb:UpdateContributorInsights",
                            "dynamodb:UpdateItem",
                            "dynamodb:UpdateTable",
                            "dynamodb:UpdateTableReplicaAutoScaling",
                            "dynamodb:UpdateTimeToLive"
                        ],
                        Resource: [
                            pulumi.interpolate`${storage.primaryDynamodbTableArn}`,
                            pulumi.interpolate`${storage.primaryDynamodbTableArn}/*`
                        ]
                    }
                ]
            }
        }
    });
}
