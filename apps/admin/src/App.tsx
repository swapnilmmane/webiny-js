import React from "react";
import { Admin } from "@webiny/app-serverless-cms";
import { Cognito } from "@webiny/app-admin-users-cognito";
import { HeadingToolbarPreset, ParagraphToolbarPreset } from "@webiny/lexical-editor";
import "./App.scss";

export const App: React.FC = () => {
    return (
        <Admin>
            <Cognito />
            <HeadingToolbarPreset />
            <ParagraphToolbarPreset />
        </Admin>
    );
};
