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
// Обеспечивает существование категории и подкатегории в БД,
// возвращает финальные id, с которыми нужно работать дальше
function ensureCategoryAndSubcategory(category: any, subcategory: any) {
  // Категория новая — создаём
  if (category.category) {
    db.prepare(
      `INSERT INTO elements (id, category, language) VALUES (?, ?, ?)`
    ).run(category.id, category.category, "jsx");
  }
  // если не новая — просто доверяем, что category.id уже существует в базе

  // Подкатегория новая — создаём
  if (subcategory.subcategory) {
    db.prepare(
      `INSERT INTO subcategories (id, element_id, title) VALUES (?, ?, ?)`
    ).run(subcategory.id, category.id, subcategory.subcategory);
  }

  return {
    categoryId: category.id as string,
    subcategoryId: subcategory.id as string,
  };
}

export async function updateCheatSheet(cheatSheet: any) {
  const { category, subcategory, sheet } = cheatSheet;

  const cleanShortName = xss((sheet.shortName || "").trim());
  const cleanCode = (sheet.codeBlock || "").trim();
  const cleanDescription = xss((sheet.description || "").trim());

  const transaction = db.transaction(() => {
    const { subcategoryId } = ensureCategoryAndSubcategory(category, subcategory);

    const result = db
      .prepare(`UPDATE sheets SET subcategory_id = ?, shortName = ?, description = ?, code = ? WHERE id = ?`)
      .run(subcategoryId, cleanShortName, cleanDescription, cleanCode, sheet.id);

    if (result.changes === 0) {
      throw new Error(`Sheet with id ${sheet.id} not found — nothing was updated`);
    }
  });

  transaction();
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

export async function getCheatSheet(idSheet: string) {
  // const cheatSheet = db.prepare("SELECT * FROM sheets WHERE id = ?").get(idSheet);
  const cheatSheet = db
    .prepare(
      `
  SELECT e.id AS "elementId", sub.id AS "subcategoryId", sh.id AS "sheetId",e.category,sub.title,  "shortName", description, code
  FROM sheets AS sh
  INNER JOIN subcategories AS sub ON sub.id = sh.subcategory_id
  INNER JOIN elements AS e ON e.id = sub.element_id
  WHERE sh.id = ?
  `,
    )
    .get(idSheet);

  if (!cheatSheet) {
    throw new Error(`Cheat Sheet not found in database`);
  }
  return cheatSheet;
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

  const cleanShortName = xss((sheet.shortName || "").trim());
  const cleanCode = (sheet.codeBlock || "").trim();
  const cleanDescription = xss((sheet.description || "").trim());

  const transaction = db.transaction(() => {
    const { subcategoryId } = ensureCategoryAndSubcategory(category, subcategory);

    db.prepare(`INSERT INTO sheets (id, subcategory_id, shortName, description, code) VALUES (?, ?, ?, ?, ?)`).run(
      sheet.id,
      subcategoryId,
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
