import React from "react";
import { PbEditorPageElementVariableRendererPlugin } from "~/types";
import LinkVariableInput from "~/editor/plugins/elementSettings/variable/LinkVariableInput";
import { useElementVariables } from "~/editor/hooks/useElementVariableValue";

export default {
    name: "pb-editor-page-element-variable-renderer-iframe",
    type: "pb-editor-page-element-variable-renderer",
    elementType: "iframe",
    getVariableValue(element) {
        const variables = useElementVariables(element);
        return variables.length > 0 ? variables[0].value : null;
    },
    renderVariableInput(variableId: string) {
        return (
            <LinkVariableInput
                variableId={variableId}
                placeholder={"https://iframe.source/goes/here"}
            />
        );
    },
    setElementValue(element, variables) {
        const newText = variables?.length > 0 ? variables[0].value : null;

        if (newText && element.data?.iframe?.url) {
            element.data.iframe.url = newText;
        }

        return element;
    }
} as PbEditorPageElementVariableRendererPlugin;
