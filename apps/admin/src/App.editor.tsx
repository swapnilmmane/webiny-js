import React from "react";
import { Admin } from "@webiny/app-serverless-cms";
import { Cognito } from "@webiny/app-admin-users-cognito";
import { Extensions } from "./Extensions";
import { Editor } from "@webiny/app-page-builder-editor";
import "./App.scss";

export const App = () => {
    return (
        <Admin>
            <Cognito />
            <Editor />
            <Extensions />
        </Admin>
    );
};
