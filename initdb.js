// eslint-disable-next-line @typescript-eslint/no-require-imports
const sql = require("better-sqlite3");
const db = sql("elements.db");

// Ваши новые данные с UUID
const ELEMENTS_LIST = [
    {
        id: "729d7494-df81-420a-86cc-e70a4175396a",
        category: "react",
        language: "jsx",
        subcategory: [
            {
                id: "3e5bbca2-fdbb-4112-9c10-cae51cf1863f",
                title: "hooks",
                sheet: [
                    {
                        id: "960579e2-51a4-47f9-906f-7389a912bbbc",
                        shortName: "useState()",
                        description: "Базовый хук для управления локальным состоянием в функциональных компонентах.",
                        code: `import React, { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  \n  const handleClick = () => {\n    setCount(prevCount => prevCount + 1);\n  };\n\n  return (\n    <div className="p-4 card">\n      <p>Вы кликнули {count} раз</p>\n      <button onClick={handleClick}>\n        Нажми на меня\n      </button>\n    </div>\n  );\n}`,
                    },
                    {
                        id: "47228a05-bd88-466d-aba2-a9b086f6630f",
                        shortName: "useRef()",
                        description:
                            "Хук для создания изменяемого объекта, который сохраняется на весь жизненный цикл компонента и не вызывает рендеринг при изменении.",
                        code: `import React, { useRef } from 'react';\n\nexport default function FocusInput() {\n  const inputRef = useRef(null);\n  \n  const handleClick = () => {\n    inputRef.current.focus();\n  };\n\n  return (\n    <div className="p-4 card">\n      <input ref={inputRef} type="text" />\n      <button onClick={handleClick}>\n        Фокус на инпут\n      </button>\n    </div>\n  );\n}`,
                    },
                ],
            },
            {
                id: "ce3e8cb1-80a5-48fa-89e9-f2e1dfda95fb",
                title: "custom hooks",
                sheet: [
                    {
                        id: "542a2b37-29cb-4fa1-8280-5bfa607e868a",
                        shortName: "useDebounce()",
                        description:
                            "Хук задерживает обновление значения до истечения указанного времени, снижая частоту запросов или тяжелых рендеров.",
                        code: `// useDebounce.ts\nimport { useState, useEffect } from "react";\n\nexport default function useDebounce<T>(value: T, delay: number = 500): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n\n\n// SearchInput.tsx\nimport { useState, useEffect } from "react";\nimport useDebounce from "./useDebounce";\n\nexport default function SearchInput() {\n  const [search, setSearch] = useState("");\n  const debouncedSearch = useDebounce(search, 300);\n\n  useEffect(() => {\n    if (debouncedSearch) {\n      console.log("Запрос к API для:", debouncedSearch);\n    }\n  }, [debouncedSearch]);\n\n  return (\n    <input\n      type="text"\n      value={search}\n      onChange={(e) => setSearch(e.target.value)}\n      placeholder="Поиск..."\n    />\n  );\n}`,
                    },
                ],
            },
        ],
    },
    {
        id: "d83fb2ba-94bc-448f-9a40-2810a9cfcb12",
        category: "typescript",
        language: "ts",
        subcategory: [
            {
                id: "898a96fc-9e32-4752-9441-df396e949666",
                title: "utility types",
                sheet: [
                    {
                        id: "be9ba0ee-3e0e-4fa2-bf4f-eef49e8979cb",
                        shortName: "Partial<T>",
                        description: "Делает все свойства типа необязательными.",
                        code: `interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nfunction updateUser(id: number, fieldsToUpdate: Partial<User>) {\n  return { id, ...fieldsToUpdate };\n}`,
                    },
                    {
                        id: "277bbfe6-a9cc-47ee-80fb-cd7fe77508fa",
                        shortName: "Pick<T, K>",
                        description: "Создает тип, выбирая набор свойств K из типа T.",
                        code: `interface Todo {\n  id: number;\n  title: string;\n  completed: boolean;\n}\n\ntype TodoPreview = Pick<Todo, "title" | "completed">;\n\nconst todo: TodoPreview = {\n  title: "Купить молоко",\n  completed: false\n};`,
                    },
                ],
            },
            {
                id: "b458b688-4cbf-488f-99e2-2a77b8f9e612",
                title: "generics",
                sheet: [
                    {
                        id: "198aee80-5a33-4fdb-a808-8df0e782ea2e",
                        shortName: "Generic Functions",
                        description: "Компоненты, способные работать с различными типами, а не с одним единственным.",
                        code: `function identity<T>(arg: T): T {\n  return arg;\n}\n\nconst output1 = identity<string>("myString");\nconst output2 = identity<number>(100);`,
                    },
                ],
            },
        ],
    },
];

// Включаем поддержку внешних ключей в SQLite
db.pragma("foreign_keys = ON");

// Создаем таблицы с правильным типом TEXT для всех ID
db.prepare(
    `
    CREATE TABLE IF NOT EXISTS elements (
                                            id TEXT PRIMARY KEY,
                                            category TEXT,
                                            language TEXT
    );
`,
).run();

db.prepare(
    `
    CREATE TABLE IF NOT EXISTS subcategories (
                                                 id TEXT PRIMARY KEY,
                                                 element_id TEXT,
                                                 title TEXT,
                                                 FOREIGN KEY (element_id) REFERENCES elements (id) ON DELETE CASCADE
        );
`,
).run();

db.prepare(
    `
    CREATE TABLE IF NOT EXISTS sheets (
                                          id TEXT PRIMARY KEY,          -- Изменено на TEXT для UUID
                                          subcategory_id TEXT,         -- Изменено на TEXT для UUID
                                          shortName TEXT,
                                          description TEXT,
                                          code TEXT,
                                          FOREIGN KEY (subcategory_id) REFERENCES subcategories (id) ON DELETE CASCADE
        );
`,
).run();

function initData() {
    const insertElement = db.prepare(`
        INSERT OR REPLACE INTO elements (id, category, language) 
        VALUES (@id, @category, @language)
    `);

    const insertSubcategory = db.prepare(`
        INSERT OR REPLACE INTO subcategories (id, element_id, title) 
        VALUES (@id, @element_id, @title)
    `);

    const insertSheet = db.prepare(`
        INSERT OR REPLACE INTO sheets (id, subcategory_id, shortName, description, code) 
        VALUES (@id, @subcategory_id, @shortName, @description, @code)
    `);

    // Транзакция для безопасной и быстрой вставки всех уровней вложенности
    const transaction = db.transaction(() => {
        for (const element of ELEMENTS_LIST) {
            // 1. Вставляем элемент
            insertElement.run({
                id: element.id,
                category: element.category,
                language: element.language,
            });

            // 2. Вставляем его подкатегории
            if (element.subcategory) {
                for (const sub of element.subcategory) {
                    insertSubcategory.run({
                        id: sub.id,
                        element_id: element.id,
                        title: sub.title,
                    });

                    // 3. Вставляем шпаргалки (sheets) для этой подкатегории
                    if (sub.sheet) {
                        for (const sheet of sub.sheet) {
                            insertSheet.run({
                                id: sheet.id,
                                subcategory_id: sub.id,
                                shortName: sheet.shortName,
                                description: sheet.description,
                                code: sheet.code,
                            });
                        }
                    }
                }
            }
        }
    });

    transaction();
    console.log("База данных успешно инициализирована данными.");
}

// Запуск заполнения
initData();
