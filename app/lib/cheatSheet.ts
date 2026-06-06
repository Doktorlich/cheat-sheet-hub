import fs from "node:fs";

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import { ICategory, Sheet, Subcategory } from "@/app/lib/types/type-db";

const db = sql("elements.db");

export async function getCategories(): Promise<ICategory[]> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return db.prepare("SELECT * FROM elements").all() as ICategory[];
}

export async function getCategory(categorySlug: string): Promise<ICategory> {
    // 1. Получаем основную категорию
    const category = db.prepare("SELECT * FROM elements WHERE category = ?").get(categorySlug) as ICategory | undefined;

    // Если категория вообще не найдена в базе, возвращаем null или кидаем ошибку
    if (!category) {
        throw new Error(`Category ${categorySlug} not found in database`);
    }

    // 2. Получаем все подкатегории, привязанные к этой категории
    // (Предполагаем, что в таблице subcategories есть внешний ключ element_id или category_id)
    const subcategories = db
        .prepare("SELECT * FROM subcategories WHERE element_id = ?")
        .all(category.id) as Subcategory[];

    // 3. Для каждой подкатегории собираем её карточки (sheets)
    category.subcategory = subcategories.map(sub => {
        const sheets = db.prepare("SELECT * FROM sheets WHERE subcategory_id = ?").all(sub.id) as Sheet[];

        // Возвращаем подкатегорию со вложенным массивом карточек
        return {
            ...sub,
            sheet: sheets,
        };
    });

    return category;
}

export async function getAllCategoriesData(): Promise<ICategory[]> {
    // 1. Получаем абсолютно все основные категории из базы
    const allCategories = db.prepare("SELECT * FROM elements").all() as ICategory[];

    // 2. Бежим циклом по каждой категории
    return allCategories.map(category => {
        // 3. Для текущей категории достаем все её подкатегории
        const subcategories = db
            .prepare("SELECT * FROM subcategories WHERE element_id = ?")
            .all(category.id) as Subcategory[];

        // 4. Для каждой подкатегории собираем её карточки (sheets)
        const subcategoriesWithSheets = subcategories.map(sub => {
            const sheets = db.prepare("SELECT * FROM sheets WHERE subcategory_id = ?").all(sub.id) as Sheet[];

            return {
                ...sub,
                sheet: sheets,
            };
        });

        // 5. Возвращаем категорию, куда вставили собранный массив подкатегорий
        return {
            ...category,
            subcategory: subcategoriesWithSheets,
        };
    });
}

export async function getEditCheatSheet(cheatSheet: unknown) {
    return;
}

export async function saveCheatSheet(cheatSheet: unknown) {
    return;
}
