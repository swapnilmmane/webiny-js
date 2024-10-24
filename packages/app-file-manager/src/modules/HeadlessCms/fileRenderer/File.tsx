import React, { useCallback } from "react";
import { Image } from "@webiny/app/components";
import * as Ui from "@webiny/ui/ImageUpload";
import { createRenderImagePreview, imagePlugins } from "./utils";
import fileIcon from "@material-design-icons/svg/round/insert_drive_file.svg";

const imagePreviewProps = {
    transform: { width: 300 },
    style: {
        width: "100%",
        height: "100%",
        maxHeight: "160px",
        background: "repeating-conic-gradient(#efefef 0% 25%, transparent 0% 50%) 50%/25px 25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        objectFit: "contain"
    }
};

const defaultStyles = {
    width: "100%",
    height: "auto"
};

export interface FileProps {
    url: string;
    onRemove: () => void;
    onEdit?: () => void;
    placeholder?: string;
    styles?: Record<string, any>;
    showFileManager?: () => void;
}

export const File = (props: FileProps) => {
    const { url, onRemove, onEdit, placeholder, showFileManager } = props;

    const styles = props.styles || defaultStyles;

    const isImage = useCallback((url: string) => {
        return imagePlugins.some(extension => url.includes(extension));
    }, []);

    const getImageSrc = useCallback((url?: string) => {
        if (url && isImage(url)) {
            return url;
        }
        return fileIcon;
    }, []);

    // TODO @ts-refactor figure out correct type
    const defaultRenderImagePreview = (renderImageProps: any) => (
        <Image {...renderImageProps} {...imagePreviewProps} />
    );

    const renderImagePreview = (url: string) => {
        if (url && !isImage(url)) {
            return createRenderImagePreview({ value: url, imagePreviewProps });
        }

        return defaultRenderImagePreview;
    };

    return (
        <>
            <Ui.Image
                renderImagePreview={renderImagePreview(url)}
                style={styles}
                value={url ? { src: getImageSrc(url) } : null}
                uploadImage={() => {
                    if (!showFileManager) {
                        return;
                    }
                    showFileManager();
                }}
                removeImage={onRemove}
                editImage={onEdit}
                placeholder={placeholder}
                containerStyle={{ height: "auto" }}
            />
        </>
    );
};
