"use client";

import classes from "./BuilderForm.module.css";
import React, { ReactNode, useActionState } from "react";
import { buildCheatSheet } from "@/app/lib/actions";

import { ICategoryCheatSheet, Mode } from "@/app/lib/types/type-db";

interface BuilderFormProps {
  children?: ReactNode;
  initialData?: ICategoryCheatSheet;
  mode: Mode;
}

export default function BuilderForm({ initialData, mode, children }: BuilderFormProps) {
  const actionWithMeta = buildCheatSheet.bind(null, {
    mode,
    sheetId: initialData?.sheetId,
  });

  const [state, formAction, isPending] = useActionState(actionWithMeta, { messages: null });
  console.log("initialData", initialData);
  return (
    <>
      <h1 className={classes.h1}>{mode === "edit" ? "Editor Note" : "Builder Page"}</h1>
      <form className={classes["form-builder"]} action={formAction}>
        {children}

        <label htmlFor="short-name">
          short name
          <input
            type="text"
            name={"short-name"}
            id={"short-name"}
            placeholder={"enter a short name"}
            defaultValue={mode === "edit" ? initialData?.shortName : undefined}
          />
        </label>

        <label htmlFor="code-block">
          code block
          <textarea
            name={"code-block"}
            id="code-block"
            cols={30}
            rows={10}
            defaultValue={mode === "edit" ? initialData?.code : undefined}
          />
        </label>

        <label htmlFor="description">
          description
          <textarea
            name={"description"}
            id="description"
            cols={30}
            rows={10}
            defaultValue={mode === "edit" ? initialData?.description : undefined}
          />
        </label>

        <div className={classes["list-button"]}>
          <button type={"submit"}>{mode === "edit" ? "save change" : "submit"}</button>
          {/*<button type={"submit"}>{mode === "edit" ? "save change" : "submit"}</button>*/}
          <button type={"button"}>clear</button>
        </div>
      </form>
    </>
  );
}
