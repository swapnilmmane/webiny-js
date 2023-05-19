import React, {FC, useCallback, useEffect} from "react";
import { Toolbar } from "~/components/Toolbar/Toolbar";
import {$getSelection, $isRangeSelection, $isTextNode, LexicalEditor} from "lexical";
import {ToolbarType} from "~/types";
import {useRichTextEditor} from "~/hooks/useRichTextEditor";
import {getSelectedNode} from "~/utils/getSelectedNode";
import {$isCodeHighlightNode} from "@lexical/code";
import {mergeRegister} from "@lexical/utils";
import {createPortal} from "react-dom";
import {makeComposable} from "@webiny/react-composition";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";


interface useStaticToolbarProps {
    editor: LexicalEditor;
    type: ToolbarType;
    children?: React.ReactNode;
}

const useStaticToolbar: FC<useStaticToolbarProps> = ({
                                             editor,
                                             type,
                                             children
                                         }): JSX.Element | null => {
    const { nodeIsText, setNodeIsText } = useRichTextEditor();

    const updatePopup = useCallback(() => {
        editor.getEditorState().read(() => {
            // Should not to pop up the floating toolbar when using IME input
            if (editor.isComposing()) {
                return;
            }
            const selection = $getSelection();
            const nativeSelection = window.getSelection();
            const rootElement = editor.getRootElement();

            if (
                nativeSelection !== null &&
                (!$isRangeSelection(selection) ||
                    rootElement === null ||
                    !rootElement.contains(nativeSelection.anchorNode))
            ) {
                setNodeIsText(false);
                return;
            }

            if (!$isRangeSelection(selection)) {
                return;
            }

            const node = getSelectedNode(selection);
            if (
                !$isCodeHighlightNode(selection.anchor.getNode()) &&
                selection.getTextContent() !== ""
            ) {
                setNodeIsText($isTextNode(node));
            } else {
                setNodeIsText(false);
            }
        });
    }, [editor]);

    useEffect(() => {
        document.addEventListener("selectionchange", updatePopup);
        return () => {
            document.removeEventListener("selectionchange", updatePopup);
        };
    }, [updatePopup]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(() => {
                updatePopup();
            }),
            editor.registerRootListener(() => {
                if (editor.getRootElement() === null) {
                    setNodeIsText(false);
                }
            })
        );
    }, [editor, updatePopup]);

    return(
        <div  className="toolbar">
            {editor.isEditable() && children}
        </div>
    );
};

export interface StaticToolbarToolbarProps {
    type: ToolbarType;

    children?: React.ReactNode;
}

/**
 * @description Main toolbar container
 */
export const StaticToolbar = makeComposable<StaticToolbarToolbarProps>(
    "StaticToolbar",
    ({ type, children }): JSX.Element | null => {
        const [editor] = useLexicalComposerContext();
        return useStaticToolbar({ editor, type, children });
    }
);
