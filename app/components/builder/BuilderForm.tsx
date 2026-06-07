"use client"

import classes from "./BuilderForm.module.css";
import React, { ReactNode, useActionState } from "react";
import { buildCheatSheet } from "@/app/lib/actions";


interface BuilderFormProps {
    // categories: ICategory;
    children?: ReactNode;
}

export default function BuilderForm({ children }: BuilderFormProps) {
    const [state, formAction, isPending] = useActionState(buildCheatSheet, { messages: null });

    return (
        <form className={classes["form-builder"]} action={formAction}>
            {children}
            <label htmlFor="short-name">
                short name
                <input type="text" name={"short-name"} id={"short-name"} placeholder={"enter a short name"} />
            </label>

            <label htmlFor="code-block">
                code block
                <textarea name={"code-block"} id="code-block" cols={30} rows={10} />
            </label>

            <label htmlFor="description">
                description
                <textarea name={"description"} id="description" cols={30} rows={10} />
            </label>

            <div className={classes["list-button"]}>
                <button type={"submit"}>submit</button>
                <button type={"button"}>clear</button>
            </div>
        </form>
    );
}
