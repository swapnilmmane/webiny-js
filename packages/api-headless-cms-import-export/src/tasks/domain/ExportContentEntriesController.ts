import uniqueId from "uniqid";
import { ITaskResponseResult, ITaskRunParams, TaskDataStatus } from "@webiny/tasks";
import { Context } from "~/types";
import {
    ExportContentEntriesControllerState,
    IExportContentEntriesControllerInput,
    IExportContentEntriesControllerOutput
} from "~/tasks/domain/abstractions/ExportContentEntriesController";
import { EXPORT_CONTENT_ASSETS_TASK, EXPORT_CONTENT_ENTRIES_TASK } from "~/tasks";
import {
    IExportContentEntriesInput,
    IExportContentEntriesOutput
} from "~/tasks/domain/abstractions/ExportContentEntries";
import {
    IExportContentAssetsInput,
    IExportContentAssetsOutput
} from "~/tasks/domain/abstractions/ExportContentAssets";

export class ExportContentEntriesController<
    C extends Context = Context,
    I extends IExportContentEntriesControllerInput = IExportContentEntriesControllerInput,
    O extends IExportContentEntriesControllerOutput = IExportContentEntriesControllerOutput
> implements ExportContentEntriesController<C, I, O>
{
    public async run(params: ITaskRunParams<C, I, O>): Promise<ITaskResponseResult<I, O>> {
        const { context, response, input, store, trigger } = params;
        const { state } = input;

        const taskId = store.getTask().id;
        /**
         * In case of no state yet, we will start the content entries export process.
         */
        const prefix = input.prefix || uniqueId(`cms-export/${input.modelId}/${taskId}/`);
        if (!state) {
            const task = await trigger<IExportContentEntriesInput>({
                definition: EXPORT_CONTENT_ENTRIES_TASK,
                input: {
                    prefix,
                    modelId: input.modelId,
                    limit: input.limit,
                    where: input.where,
                    sort: input.sort,
                    after: undefined
                },
                name: `Export Content Entries ${taskId}`
            });

            return response.continue(
                {
                    ...input,
                    prefix,
                    contentEntriesTaskId: task.id,
                    state: ExportContentEntriesControllerState.entryExport
                },
                {
                    seconds: 60
                }
            );
        }
        /**
         * If the state of the task is "entryExport", we need to check if there are any child tasks of the "Export Content Entries" task.
         * If there are, we need to wait for them to finish before we can proceed.
         * If there are no child tasks, we'll return an error.
         * If there are child tasks, but they are not finished, we'll return a "continue" response, which will make the task wait for X seconds before checking again.
         */
        //
        else if (state === ExportContentEntriesControllerState.entryExport) {
            if (!input.contentEntriesTaskId) {
                return response.error({
                    message: `Missing "contentEntriesTaskId" in the input, but the input notes that the task is in "entryExport" state. This should not happen.`,
                    code: "MISSING_CONTENT_ENTRIES_TASK_ID"
                });
            }
            const task = await context.tasks.getTask<
                IExportContentEntriesInput,
                IExportContentEntriesOutput
            >(input.contentEntriesTaskId);
            if (!task) {
                return response.error({
                    message: `Task "${input.contentEntriesTaskId}" not found.`,
                    code: "TASK_NOT_FOUND"
                });
            }
            if (
                task.taskStatus == TaskDataStatus.RUNNING ||
                task.taskStatus === TaskDataStatus.PENDING
            ) {
                return response.continue(input, {
                    seconds: 60
                });
            } else if (task.taskStatus === TaskDataStatus.FAILED) {
                return response.error({
                    message: `Failed to export content entries. Task "${task.id}" failed.`,
                    code: "EXPORT_ENTRIES_FAILED"
                });
            } else if (task.taskStatus === TaskDataStatus.ABORTED) {
                return response.error({
                    message: `Export content entries process was aborted. Task "${task.id}" was aborted.`,
                    code: "EXPORT_ENTRIES_ABORTED"
                });
            } else if (!task.output) {
                return response.error({
                    message: `No output found on task "${task.id}". Stopping export process.`,
                    code: "NO_OUTPUT"
                });
            }

            const assetTask = await trigger<IExportContentAssetsInput>({
                definition: EXPORT_CONTENT_ASSETS_TASK,
                input: {
                    prefix,
                    modelId: input.modelId,
                    limit: input.limit,
                    where: input.where,
                    sort: input.sort,
                    after: undefined
                },
                name: `Export Content Assets ${taskId}`
            });

            return response.continue({
                ...input,
                contentAssetsTaskId: assetTask.id,
                state: ExportContentEntriesControllerState.assetsExport
            });
        }
        /**
         * If the state is "assetsExport", we need to check if there are any child tasks of the "Export Content Assets" task.
         * If there are, we need to wait for them to finish before we can proceed.
         * If there are no child tasks, we'll return as done.
         * If there are child tasks, but they are not finished, we'll return a "continue" response, which will make the task wait for X seconds before checking again.
         */
        //
        else if (state === ExportContentEntriesControllerState.assetsExport) {
            if (!input.contentAssetsTaskId) {
                return response.error({
                    message: `Missing "contentAssetsTaskId" in the input, but the input notes that the task is in "assetsExport" state. This should not happen.`,
                    code: "MISSING_CONTENT_ASSETS_TASK_ID"
                });
            }

            const task = await context.tasks.getTask<
                IExportContentAssetsInput,
                IExportContentAssetsOutput
            >(input.contentAssetsTaskId);
            if (!task) {
                return response.error({
                    message: `Task "${input.contentAssetsTaskId}" not found.`,
                    code: "TASK_NOT_FOUND"
                });
            }
            if (
                task.taskStatus == TaskDataStatus.RUNNING ||
                task.taskStatus === TaskDataStatus.PENDING
            ) {
                return response.continue(
                    {
                        ...input
                    },
                    {
                        seconds: 60
                    }
                );
            } else if (task.taskStatus === TaskDataStatus.FAILED) {
                return response.error({
                    message: `Failed to export content assets. Task "${task.id}" failed.`,
                    code: "EXPORT_ASSETS_FAILED"
                });
            } else if (task.taskStatus === TaskDataStatus.ABORTED) {
                return response.error({
                    message: `Export content assets process was aborted. Task "${task.id}" was aborted.`,
                    code: "EXPORT_ASSETS_ABORTED"
                });
            }
        }

        return response.error({
            message: `Invalid state "${state}".`,
            code: "INVALID_STATE"
        });
    }
}
