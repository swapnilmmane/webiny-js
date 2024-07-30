import { Options as BaseUploadOptions, Upload as BaseUpload } from "@webiny/aws-sdk/lib-storage";
import { PassThrough } from "stream";
import type { CompleteMultipartUploadCommandOutput, S3Client } from "@webiny/aws-sdk/client-s3";
import { IAwsUpload, IUpload, IUploadOnListener } from "./abstractions/Upload";
import { getContentType } from "./getContentType";

export interface IUploadConfig {
    client: S3Client;
    stream: PassThrough;
    bucket: string;
    filename: string;
    factory?(params: BaseUploadOptions): IAwsUpload;
    queueSize?: number;
}

const defaultFactory = (options: BaseUploadOptions): BaseUpload => {
    return new BaseUpload(options);
};

export class Upload implements IUpload {
    public readonly stream: PassThrough;
    public readonly upload: IAwsUpload;
    private readonly client: S3Client;

    public constructor(params: IUploadConfig) {
        this.client = params.client;

        const factory = params?.factory || defaultFactory;

        this.upload = factory({
            client: params.client,
            params: {
                ACL: "private",
                Body: params.stream,
                Bucket: params.bucket,
                ContentType: getContentType(params.filename),
                Key: params.filename
            },
            queueSize: params.queueSize || 1,
            partSize: 1024 * 1024 * 5,
            leavePartsOnError: false
        });
        this.stream = params.stream;
    }

    public async abort(): Promise<void> {
        await this.upload.abort();
        this.client.destroy();
    }

    public async done(): Promise<CompleteMultipartUploadCommandOutput> {
        const result = await this.upload.done();
        this.client.destroy();
        return result;
    }

    public onProgress(listener: IUploadOnListener): void {
        this.upload.on("httpUploadProgress", listener);
    }
}

export interface ICreateUploadFactoryParams {
    client: S3Client;
    bucket: string;
}

export interface ICreateUploadCallable {
    (filename: string): IUpload;
}

export const createUploadFactory = (params: ICreateUploadFactoryParams): ICreateUploadCallable => {
    return filename => {
        const stream = new PassThrough({
            autoDestroy: true
        });

        return new Upload({
            client: params.client,
            bucket: params.bucket,
            stream,
            filename
        });
    };
};
