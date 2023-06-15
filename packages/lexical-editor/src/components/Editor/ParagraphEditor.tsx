import React from "react";
import { CodeHighlightPlugin } from "~/plugins/CodeHighlightPlugin/CodeHighlightPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { FloatingLinkEditorPlugin } from "~/plugins/FloatingLinkEditorPlugin/FloatingLinkEditorPlugin";
import { ClickableLinkPlugin } from "~/plugins/ClickableLinkPlugin/ClickableLinkPlugin";
import { RichTextEditor, RichTextEditorProps } from "~/components/Editor/RichTextEditor";
import { WebinyListPlugin } from "~/plugins/WebinyListPLugin/WebinyListPlugin";
import { Toolbar } from "~/components/Toolbar/Toolbar";

interface ParagraphLexicalEditorProps extends RichTextEditorProps {
    tag?: "p";
}

const ParagraphEditor: React.FC<ParagraphLexicalEditorProps> = ({ placeholder, tag, ...rest }) => {
    return (
        <RichTextEditor
            toolbar={<Toolbar />}
            tag={tag ?? "p"}
            placeholder={placeholder ?? "Enter your text here..."}
            {...rest}
            styles={{ padding: 5 }}
        >
            <LinkPlugin />
            <WebinyListPlugin />
            <CodeHighlightPlugin />
            <ClickableLinkPlugin />
            <FloatingLinkEditorPlugin anchorElem={document.body} />
            {rest?.children}
        </RichTextEditor>
    );
};

export { ParagraphEditor };
