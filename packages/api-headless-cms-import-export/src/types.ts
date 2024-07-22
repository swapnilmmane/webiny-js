import { FileManagerContext } from "@webiny/api-file-manager/types";
import { Context as TasksContext, TaskDataStatus } from "@webiny/tasks/types";
import { ICmsImportExportRecord } from "./domain/abstractions/CmsImportExportRecord";
import { GenericRecord, NonEmptyArray } from "@webiny/api/types";

export * from "./domain/abstractions/CmsImportExportRecord";

export enum CmsImportExportFileType {
    COMBINED_ENTRIES = "combinedEntries",
    ENTRIES = "entries",
    ASSETS = "assets"
}

export interface ICmsImportExportObjectGetExportParams {
    id: string;
}

export interface ICmsImportExportObjectStartExportParams {
    modelId: string;
    exportAssets: boolean;
    limit?: number;
}

export interface ICmsImportExportObjectAbortExportParams {
    id: string;
}

export interface ICmsImportExportObjectValidateImportFromUrlParams {
    data: string;
}

export interface ICmsImportExportFile {
    get: string;
    head: string;
    type: CmsImportExportFileType;
    error?: ICmsImportExportValidatedFileError;
}

export interface ICmsImportExportObjectValidateImportFromUrlResult {
    files: NonEmptyArray<ICmsImportExportFile>;
    id: string;
    status: TaskDataStatus;
}

export interface ICmsImportExportObjectGetValidateImportFromUrlParams {
    id: string;
}

export interface ICmsImportExportValidatedFileError {
    message: string;
    data?: GenericRecord;
}

export interface ICmsImportExportValidatedFile {
    get: string;
    head: string;
    type: CmsImportExportFileType | undefined;
    size?: number;
    error?: ICmsImportExportValidatedFileError;
}

export interface ICmsImportExportObjectGetValidateImportFromUrlResult {
    id: string;
    files: NonEmptyArray<ICmsImportExportValidatedFile> | undefined;
    status: TaskDataStatus;
    error?: GenericRecord;
}

export interface CmsImportExportObject {
    getExportContentEntries(
        params: ICmsImportExportObjectGetExportParams
    ): Promise<ICmsImportExportRecord>;
    exportContentEntries(
        params: ICmsImportExportObjectStartExportParams
    ): Promise<ICmsImportExportRecord>;
    abortExportContentEntries(
        params: ICmsImportExportObjectAbortExportParams
    ): Promise<ICmsImportExportRecord>;
    validateImportFromUrl(
        params: ICmsImportExportObjectValidateImportFromUrlParams
    ): Promise<ICmsImportExportObjectValidateImportFromUrlResult>;
    getValidateImportFromUrl(
        params: ICmsImportExportObjectGetValidateImportFromUrlParams
    ): Promise<ICmsImportExportObjectGetValidateImportFromUrlResult>;
}

export interface Context extends FileManagerContext, TasksContext {
    cmsImportExport: CmsImportExportObject;
}
