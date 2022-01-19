import { ApwReviewerStorageOperations } from "./types";
import {
    baseFields,
    CreateApwStorageOperationsParams,
    getFieldValues
} from "~/storageOperations/index";

export const createReviewerStorageOperations = ({
    cms
}: Pick<CreateApwStorageOperationsParams, "cms">): ApwReviewerStorageOperations => {
    const getReviewerModel = () => {
        return cms.getModel("apwReviewerModelDefinition");
    };
    const getReviewer: ApwReviewerStorageOperations["getReviewer"] = async ({ id }) => {
        const model = await getReviewerModel();
        const entry = await cms.getEntryById(model, id);
        return getFieldValues(entry, baseFields);
    };
    return {
        getReviewerModel,
        getReviewer,
        async listReviewers(params) {
            const model = await getReviewerModel();
            const [entries, meta] = await cms.listLatestEntries(model, params);
            return [entries.map(entry => getFieldValues(entry, baseFields)), meta];
        },
        async createReviewer(params) {
            const model = await getReviewerModel();
            const entry = await cms.createEntry(model, params.data);
            return getFieldValues(entry, baseFields);
        },
        async updateReviewer(params) {
            const model = await getReviewerModel();
            /**
             * We're fetching the existing entry here because we're not accepting "app" field as input,
             * but, we still need to retain its value after the "update" operation.
             */
            const existingEntry = await getReviewer({ id: params.id });

            const entry = await cms.updateEntry(model, params.id, {
                ...existingEntry,
                ...params.data
            });
            return getFieldValues(entry, baseFields);
        },
        async deleteReviewer(params) {
            const model = await getReviewerModel();
            await cms.deleteEntry(model, params.id);
            return true;
        }
    };
};
