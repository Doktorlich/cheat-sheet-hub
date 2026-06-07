"use server";

import fs from "node:fs";

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import { ICategory, Sheet, Subcategory } from "@/app/lib/types/type-db";

const db = sql("elements.db");

export async function getCategories(): Promise<ICategory[]> {
    // await new Promise(resolve => setTimeout(resolve, 2000));
    return db.prepare("SELECT * FROM elements").all() as ICategory[];
}

export async function getCategory(categorySlug: string): Promise<ICategory> {
    // Декодируем %D1%84... обратно в нормальные русские буквы
    const decodedSlug = decodeURIComponent(categorySlug);
    // 1. Получаем основную категорию
    const category = db.prepare("SELECT * FROM elements WHERE category = ?").get(decodedSlug) as ICategory | undefined;

    // Если категория вообще не найдена в базе, возвращаем null или кидаем ошибку
    if (!category) {
        throw new Error(`Category ${decodedSlug} not found in database`);
    }

    // 2. Получаем все подкатегории, привязанные к этой категории
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
export async function saveCheatSheet(cheatSheet: any) {
    const { category, subcategory, sheet } = cheatSheet;

    // 1. Очищаем строки от XSS.
    // Обратите внимание: берём sheet.codeBlock, как вы и передали в экшене!
    const cleanShortName = xss((sheet.shortName || "").trim());
    const cleanCode = (sheet.codeBlock || "").trim();
    const cleanDescription = xss((sheet.description || "").trim());

    // 2. Запускаем транзакцию
    const transaction = db.transaction(() => {
        // ==================================================
        // ШАГ 1: КАТЕГОРИЯ (elements)
        // ==================================================
        // Проверяем, пришло ли имя новой категории (значит, это была опция "other")
        if (category.category) {
            db.prepare(
                `
                INSERT INTO elements (id, category, language) 
                VALUES (?, ?, ?)
            `,
            ).run(category.id, category.category, "jsx"); // язык по умолчанию
        }
        // Если категория существующая, мы её НЕ трогаем и НЕ перезаписываем,
        // так как она уже есть в таблице elements под своим category.id

        // ==================================================
        // ШАГ 2: ПОДКАТЕГОРИЯ (subcategories)
        // ==================================================
        // Проверяем, пришло ли имя новой подкатегории
        if (subcategory.subcategory) {
            // ВАЖНО: В SQL-запросе пишем колонку "title" (как в вашей схеме БД),
            // а значение передаем из вашего объекта subcategory.subcategory
            db.prepare(
                `
                INSERT INTO subcategories (id, element_id, title) 
                VALUES (?, ?, ?)
            `,
            ).run(subcategory.id, category.id, subcategory.subcategory);
        }
        // Если подкатегория существующая, мы её тоже НЕ перезаписываем,
        // она уже лежит в базе под своим subcategory.id

        // ==================================================
        // ШАГ 3: ШПАРГАЛКА (sheets)
        // ==================================================
        // Карта (sheet) создается ВСЕГДА. Привязываем её к subcategory.id
        db.prepare(
            `
            INSERT INTO sheets (id, subcategory_id, shortName, description, code) 
            VALUES (?, ?, ?, ?, ?)
        `,
        ).run(
            sheet.id, // UUID из экшена
            subcategory.id, // ID подкатегории (новый UUID или старый из селекта)
            cleanShortName,
            cleanDescription,
            cleanCode,
        );
    });

    transaction();
}

export async function getEditCheatSheet(cheatSheet: unknown) {
    return;
}
