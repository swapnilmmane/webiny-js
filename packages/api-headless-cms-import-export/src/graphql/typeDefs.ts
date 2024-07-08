export const createTypeDefs = (models: [string, ...string[]]): string => {
    return /* GraphQL */ `
        enum ExportContentEntriesExportRecordStatusEnum {
            pending
            running
            failed
            success
            aborted
        }
        
        type ExportContentEntriesExportRecordFile {
            url: String!
            expiresOn: DateTime!
            type: String!
        }
        
        type ExportContentEntriesExportRecord {
            id: ID!
            createdOn: DateTime!
            createdBy: CmsIdentity!
            finishedOn: DateTime
            modelId: String!
            files: [ExportContentEntriesExportRecordFile!]
            exportAssets: Boolean!
            status: ExportContentEntriesExportRecordStatusEnum!
        }
        
        type ExportContentEntriesResponse {
            data: ExportContentEntriesExportRecord
            error: CmsError
        }
        
        type StartExportContentEntriesResponse {
            data: ExportContentEntriesExportRecord
            error: CmsError
        }

        type AbortExportContentEntriesResponse {
            data: ExportContentEntriesExportRecord
            error: CmsError
        }
        
        enum ExportContentEntriesModelsListEnum {
            ${models.join("\n")}
        }
        
        extend type Query {
            getExportContentEntries(id: ID!): ExportContentEntriesResponse!
        }

        extend type Mutation {
            startExportContentEntries(
                modelId: ExportContentEntriesModelsListEnum!
                # limit on how much entries will be fetched in a single batch - mostly used for testing
                limit: Int
                # do we export assets as well? default is false
                exportAssets: Boolean
            ): StartExportContentEntriesResponse!
            abortExportContentEntries(id: ID!): AbortExportContentEntriesResponse!
        }
    `;
};
