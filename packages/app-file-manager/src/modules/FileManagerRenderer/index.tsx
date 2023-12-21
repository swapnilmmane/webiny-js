import React from "react";
import { Wcp } from "@webiny/app-admin";
import { DeleteFolder, EditFolder, SetFolderPermissions } from "@webiny/app-aco";
import { FileManagerViewConfig as FileManagerConfig } from "~/index";
import { FileManagerRenderer } from "./FileManagerView";
import { FilterByType } from "./filters/FilterByType";
import { ActionDelete, ActionEdit, ActionMove } from "~/components/BulkActions";
import { Name } from "~/components/FileDetails/components/Name";
import { Tags } from "~/components/FileDetails/components/Tags";
import { Aliases } from "~/components/FileDetails/components/Aliases";
import { AccessControl } from "~/components/FileDetails/components/AccessControl";

const { Browser, FileDetails } = FileManagerConfig;

export const FileManagerRendererModule = () => {
    return (
        <>
            <FileManagerRenderer />
            <FileManagerConfig>
                <Browser.FilterByTags />
                <Browser.Filter name={"type"} element={<FilterByType />} />
                <Browser.BulkAction name={"edit"} element={<ActionEdit />} />
                <Browser.BulkAction name={"move"} element={<ActionMove />} />
                <Browser.BulkAction name={"delete"} element={<ActionDelete />} />
                <Browser.FolderAction name={"edit"} element={<EditFolder />} />
                <Browser.FolderAction name={"permissions"} element={<SetFolderPermissions />} />
                <Browser.FolderAction name={"delete"} element={<DeleteFolder />} />
                <FileDetails.Field name={"name"} element={<Name />} />
                <FileDetails.Field name={"tags"} element={<Tags />} />
                <FileDetails.Field name={"aliases"} element={<Aliases />} />
                <Wcp.CanUsePrivateFiles>
                    <FileDetails.Field name={"accessControl"} element={<AccessControl />} />
                </Wcp.CanUsePrivateFiles>
                <FileDetails.GroupFields value={false} />
                <FileDetails.Width value={"1000px"} />
            </FileManagerConfig>
        </>
    );
};
