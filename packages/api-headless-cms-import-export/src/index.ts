import { ContextPlugin } from "@webiny/api";
import { Plugin } from "@webiny/plugins/types";
import { attachHeadlessCmsImportExportGraphQL } from "~/graphql";
import { Context } from "./types";
import { isHeadlessCmsReady } from "@webiny/api-headless-cms";
import { createHeadlessCmsImportExportCrud } from "~/crud";
import {
    createExportContentAssets,
    createExportContentEntriesControllerTask,
    createExportContentEntriesTask,
    createImportFromUrlControllerTask,
    createImportFromUrlDownloadTask,
    createValidateImportFromUrlTask,
    createImportFromUrlProcessEntriesTask,
    createImportFromUrlProcessAssetsTask
} from "~/tasks";

export const createHeadlessCmsImportExport = (): Plugin[] => {
    const plugin = new ContextPlugin<Context>(async context => {
        const installed = await isHeadlessCmsReady(context);
        if (!installed) {
            return;
        }

        context.plugins.register(
            createExportContentEntriesControllerTask(),
            createExportContentEntriesTask(),
            createExportContentAssets(),
            createValidateImportFromUrlTask(),
            createImportFromUrlControllerTask(),
            createImportFromUrlDownloadTask(),
            createImportFromUrlProcessEntriesTask(),
            createImportFromUrlProcessAssetsTask()
        );

        context.cmsImportExport = await createHeadlessCmsImportExportCrud(context);
        await attachHeadlessCmsImportExportGraphQL(context);
    });
    plugin.name = "headlessCms.context.importExport";
    return [plugin];
};
