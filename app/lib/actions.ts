"use server";

import { saveCheatSheet, updateCheatSheet } from "@/app/lib/cheatSheet";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Mode } from "@/app/lib/types/type-db";

type ActionMeta = {mode: Mode; sheetId?:string}
function isInvalidateText(text: string) {
    return !text || text.trim() === "";
}
function isReservedWord(text: string) {
  return text.trim().toLowerCase() === "other";
}
export async function buildCheatSheet(meta: ActionMeta, prevState: never, formData: FormData) {
  const category =
    formData.get("category") === "other"
      ? { id: crypto.randomUUID(), category: formData.get("new-category") }
      : { id: formData.get("category") };

  const subcategory =
    formData.get("subcategory") === "other"
      ? { id: crypto.randomUUID(), subcategory: formData.get("new-subcategory") }
      : { id: formData.get("subcategory") };

  const sheet = {
    id: meta.mode === "edit" ? meta.sheetId! : crypto.randomUUID(),
    shortName: formData.get("short-name"),
    codeBlock: formData.get("code-block"),
    description: formData.get("description"),
  };

  const cheatSheet = { category, subcategory, sheet };

  const isCategoryInvalid =
    formData.get("category") === "other"
      ? isInvalidateText(cheatSheet.category.category as string)
      : isInvalidateText(cheatSheet.category.id as string);

  const isSubcategoryInvalid =
    formData.get("subcategory") === "other"
      ? isInvalidateText(cheatSheet.subcategory.subcategory as string)
      : isInvalidateText(cheatSheet.subcategory.id as string);

  const isSheetInvalid =
    isInvalidateText(cheatSheet.sheet.codeBlock as string) ||
    isInvalidateText(cheatSheet.sheet.description as string) ||
    isInvalidateText(cheatSheet.sheet.shortName as string);

  if (isCategoryInvalid || isSubcategoryInvalid || isSheetInvalid) {
    return { messages: "An error occurred while validating the form input" };
  }

  const isCategoryReserved =
    formData.get("category") === "other" && isReservedWord(cheatSheet.category.category as string);
  const isSubcategoryReserved =
    formData.get("subcategory") === "other" && isReservedWord(cheatSheet.subcategory.subcategory as string);

  if (isCategoryInvalid || isSubcategoryInvalid || isSheetInvalid || isCategoryReserved || isSubcategoryReserved) {
    return { messages: "Category/subcategory name cannot be 'other'" };
  }

  if (meta.mode === "edit") {
    await updateCheatSheet(cheatSheet);
  } else {
    await saveCheatSheet(cheatSheet);
  }

  redirect("/");
}

// category
// new-category
// subcategory
// new-subcategory
// short-name;
// code-block;
// description;
