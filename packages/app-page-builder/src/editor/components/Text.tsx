import React from "react";
import { useRecoilValue } from "recoil";
import classNames from "classnames";
import { PbElement } from "../../types";
import { elementWithChildrenByIdSelector } from "../recoil/modules";
import { ElementRoot } from "../../render/components/ElementRoot";
import useUpdateHandlers from "../plugins/elementSettings/useUpdateHandlers";
import ReactMediumEditor from "../components/MediumEditor";

export const textClassName = "webiny-pb-base-page-element-style webiny-pb-page-element-text";

type TextElementProps = {
    elementId: string;
    editorOptions: any;
    rootClassName?: string;
};
const Text: React.FunctionComponent<TextElementProps> = ({
    elementId,
    editorOptions,
    rootClassName
}) => {
    const element: PbElement = useRecoilValue(elementWithChildrenByIdSelector(elementId));
    const { getUpdateValue } = useUpdateHandlers({
        element,
        dataNamespace: "data.text"
    });

    const onChange = React.useCallback(
        value => {
            getUpdateValue("data.text")(value);
        },
        [getUpdateValue]
    );
    // required due to re-rendering when set content atom and still nothing in elements atom
    if (!element) {
        return null;
    }

    const { typography, data } = element.data.text;

    return (
        <ElementRoot
            element={element}
            className={classNames(textClassName, rootClassName, typography)}
        >
            <ReactMediumEditor value={data.text} onChange={onChange} options={editorOptions} />
        </ElementRoot>
    );
};
export default React.memo(Text);
