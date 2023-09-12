import React, { useState } from "react";

import { Button } from "./Button";
import { Drawer } from "./Drawer";

import { Field } from "./types";

interface AdvancedSearchProps {
    fields: Field[];
    onSubmit: (data: any) => void;
}

export const AdvancedSearch: React.VFC<AdvancedSearchProps> = ({ fields, onSubmit }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)} />
            <Drawer
                open={open}
                onClose={() => setOpen(false)}
                fields={fields}
                onSubmit={onSubmit}
            />
        </>
    );
};
