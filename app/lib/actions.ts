"use server";

import { saveCheatSheet } from "@/app/lib/cheatSheet";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function isInvalidateText(text: string) {
    return !text || text.trim() === "";
}

export async function buildCheatSheet(prevState: never, formData: FormData) {
    // если выбрано свойство other то в обьект передаем new-category
    // при выборе select  мы получаем строку ID т к в option передаем ID
    const category =
        formData.get("category") === "other"
            ? { id: crypto.randomUUID(), category: formData.get("new-category") }
            : { id: formData.get("category") }; // тут получааем ID из name=category
    const subcategory =
        formData.get("subcategory") === "other"
            ? { id: crypto.randomUUID(), subcategory: formData.get("new-subcategory") }
            : { id: formData.get("subcategory") };
    console.log("subcategory", subcategory);
    // мне нужно сделать поиск по существующему массиву, в нем ищем по id в category если есть поле с таким id, если нет, то принимаем новые данные
    // из new-category
    // то начинаем искать по id подкатегории если есть
    // то в данную категорию записываем cheatsheet , если нет создаем новую получая из subcategory

    const cheatSheet = {
        category: category,
        subcategory: subcategory,
        sheet: {
            id: crypto.randomUUID(),
            shortName: formData.get("short-name"),
            codeBlock: formData.get("code-block"),
            description: formData.get("description"),
        },
    };
    // 1. Проверяем категорию: если она новая, имя должно быть заполнено. Если старая — должен быть ID.
    const isCategoryInvalid =
        formData.get("category") === "other"
            ? isInvalidateText(cheatSheet.category.category)
            : isInvalidateText(cheatSheet.category.id);

    // 2. Проверяем подкатегорию по такому же принципу
    const isSubcategoryInvalid =
        formData.get("subcategory") === "other"
            ? isInvalidateText(cheatSheet.subcategory.subcategory)
            : isInvalidateText(cheatSheet.subcategory.id);

    // 3. Карточка проверяется всегда
    const isSheetInvalid =
        isInvalidateText(cheatSheet.sheet.codeBlock) ||
        isInvalidateText(cheatSheet.sheet.description) ||
        isInvalidateText(cheatSheet.sheet.shortName);

    // 4. Финальное условие
    if (isCategoryInvalid || isSubcategoryInvalid || isSheetInvalid) {
        console.log("ERROR VALIDATION");
        return { messages: "An error occurred while validating the form input" };
    }


    console.log(cheatSheet);
    await saveCheatSheet(cheatSheet);
    // revalidatePath("/")
    redirect("/");
}

// category
// new-category
// subcategory
// new-subcategory
// short-name;
// code-block;
// description;
