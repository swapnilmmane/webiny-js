import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createHandler } from "@webiny/handler-aws";
import dbPlugins from "@webiny/handler-db";
import { DynamoDbDriver } from "@webiny/db-dynamodb";
import queueAddPlugins from "@webiny/api-prerendering-service/queue/add";
import logsPlugins from "@webiny/handler-logs";

export const handler = createHandler(
    logsPlugins(),
    queueAddPlugins(),
    dbPlugins({
        table: process.env.DB_TABLE,
        driver: new DynamoDbDriver({
            documentClient: new DocumentClient({
                convertEmptyValues: true,
                region: process.env.AWS_REGION
            })
        })
    })
);
