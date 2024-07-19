import { CmsEntryListWhere } from "@webiny/api-headless-cms/types";
import { ITaskResponseDoneResultOutput, ITaskResponseResult, ITaskRunParams } from "@webiny/tasks";
import { CmsImportExportFileType, Context } from "~/types";

export enum ExportContentEntriesControllerState {
    entryExport = "entryExport",
    assetsExport = "assetsExport"
}

export interface IExportContentEntriesControllerInput {
    modelId: string;
    exportAssets: boolean;
    contentEntriesTaskId?: string;
    contentAssetsTaskId?: string;
    prefix?: string;
    limit?: number;
    where?: CmsEntryListWhere;
    sort?: string[];
    after?: string;
    state?: ExportContentEntriesControllerState;
}

export interface IExportContentEntriesControllerOutputFile {
    head: string;
    get: string;
    type: CmsImportExportFileType;
}

export interface IExportContentEntriesControllerOutput extends ITaskResponseDoneResultOutput {
    files: IExportContentEntriesControllerOutputFile[];
}

export interface IExportContentEntriesController<
    C extends Context = Context,
    I extends IExportContentEntriesControllerInput = IExportContentEntriesControllerInput,
    O extends IExportContentEntriesControllerOutput = IExportContentEntriesControllerOutput
> {
    run(params: ITaskRunParams<C, I, O>): Promise<ITaskResponseResult<I, O>>;
}
