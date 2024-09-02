import { IMultipartUploadHandler } from "~/tasks/utils/upload";
import {
    IDownloadFileFromUrl,
    IDownloadFileFromUrlProcessOnIterationCallable,
    IDownloadFileFromUrlProcessResponseType
} from "./abstractions/DownloadFileFromUrl";
import { createSizeSegments } from "~/tasks/utils/helpers/sizeSegments";

export interface IDownloadFileFromUrlFile {
    url: string;
    key: string;
    size: number;
}

interface IRange {
    start: number;
    end: number;
}

export interface IDownloadFileFromUrlParams {
    file: IDownloadFileFromUrlFile;
    fetch: typeof fetch;
    upload: IMultipartUploadHandler;
    nextRange?: number;
}

export class DownloadFileFromUrl implements IDownloadFileFromUrl {
    private readonly file: IDownloadFileFromUrlFile;
    private readonly upload: IMultipartUploadHandler;
    private readonly fetch: typeof fetch;
    private nextRange: number;
    private readonly ranges: IRange[];

    public constructor(params: IDownloadFileFromUrlParams) {
        this.file = params.file;
        this.fetch = params.fetch;
        this.nextRange = params.nextRange || 0;
        this.upload = params.upload;
        this.ranges = createSizeSegments(this.file.size, "10MB");
    }

    public async process<T extends string>(
        onIteration: IDownloadFileFromUrlProcessOnIterationCallable<T>
    ): Promise<IDownloadFileFromUrlProcessResponseType<T>> {
        let iteration = 0;

        while (true) {
            const next = this.ranges[this.nextRange];

            if (this.isDone() || !next) {
                await this.upload.complete();
                return "done";
            }
            let status: IDownloadFileFromUrlProcessResponseType<T> | undefined = undefined;
            await onIteration({
                iteration,
                next: this.nextRange,
                segment: next,
                stop: input => {
                    status = input;
                }
            });
            if (status) {
                await this.upload.complete();
                return status;
            }
            iteration++;

            const headers = new Headers();

            if (this.ranges.length > 1) {
                headers.set("Range", `bytes=${next.start}-${next.end}`);
            }
            const result = await this.fetch(this.file.url, {
                method: "GET",
                keepalive: true,
                mode: "cors",
                headers
            });
            if (!result.ok) {
                throw new Error(`Failed to fetch URL: ${this.file.url}`);
            } else if (!result.body) {
                throw new Error(`Body not found for URL: ${this.file.url}`);
            }

            const reader = result.body.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                await this.upload.add(Buffer.from(value));
            }

            reader.releaseLock();
            this.nextRange++;
        }
    }

    public async abort(): Promise<void> {
        await this.upload.abort();
    }

    public getNextRange(): number {
        return this.nextRange;
    }

    public isDone(): boolean {
        return !this.ranges[this.nextRange];
    }
}

export const createDownloadFileFromUrl = (
    params: IDownloadFileFromUrlParams
): IDownloadFileFromUrl => {
    return new DownloadFileFromUrl(params);
};
