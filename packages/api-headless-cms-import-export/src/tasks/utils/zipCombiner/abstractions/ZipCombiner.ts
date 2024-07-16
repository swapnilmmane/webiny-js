import { IIsCloseToTimeoutCallable } from "@webiny/tasks";
import { CmsModel } from "@webiny/api-headless-cms/types";

export interface IZipCombinerResolveResult {
    lastFileProcessed?: string;
    key: string;
    url: string;
    bucket: string;
    expiresOn: Date;
}

export interface IZipCombinerResolveParams {
    source: string;
    model: CmsModel;
    lastFileProcessed: string | undefined;
    isAborted: () => boolean;
    isCloseToTimeout: IIsCloseToTimeoutCallable;
}

export interface IZipCombiner {
    resolve(params: IZipCombinerResolveParams): Promise<IZipCombinerResolveResult>;
}
