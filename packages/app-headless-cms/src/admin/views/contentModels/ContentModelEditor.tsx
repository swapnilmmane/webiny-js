import React from "react";
import { Editor } from "~/admin/components/ContentModelEditor/Editor";
import { useRouter } from "@webiny/react-router";
import { useCms } from "~/admin/hooks";
import { CmsModel } from "~/types";

type QueryMatch = Pick<Partial<CmsModel>, "modelId">;

const ContentModelEditorView: React.FC = () => {
    const { params } = useRouter();
    const { apolloClient } = useCms();

    const { modelId } = (params ? params : {}) as QueryMatch;
    if (!apolloClient || !modelId) {
        return null;
    }
    return <Editor modelId={modelId} apolloClient={apolloClient} />;
};
export default ContentModelEditorView;
