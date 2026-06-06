// eslint-disable-next-line @typescript-eslint/no-require-imports
const sql = require("better-sqlite3");
const db = sql("elements.db"); // Изменили название файла БД для ясности

// Ваши новые данные
const ELEMENTS_LIST = [
    {
        id: 1,
        category: "react",
        language: "jsx",
        subcategory: [
            {
                id: 1,
                title: "hooks",
                sheet: [
                    {
                        id: 1,
                        shortName: "useState()",
                        description: "Базовый хук для управления локальным состоянием в функциональных компонентах.",
                        code: `import React, { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  \n  const handleClick = () => {\n    setCount(prevCount => prevCount + 1);\n  };\n\n  return (\n    <div className="p-4 card">\n      <p>Вы кликнули {count} раз</p>\n      <button onClick={handleClick}>\n        Нажми на меня\n      </button>\n    </div>\n  );\n}`,
                    },
                    {
                        id: 2,
                        shortName: "useRef()",
                        description:
                            "Хук для создания изменяемого объекта, который сохраняется на весь жизненный цикл компонента и не вызывает рендеринг при изменении.",
                        code: `import React, { useRef } from 'react';\n\nexport default function FocusInput() {\n  const inputRef = useRef(null);\n  \n  const handleClick = () => {\n    inputRef.current.focus();\n  };\n\n  return (\n    <div className="p-4 card">\n      <input ref={inputRef} type="text" />\n      <button onClick={handleClick}>\n        Фокус на инпут\n      </button>\n    </div>\n  );\n}`,
                    },
                ],
            },
            {
                id: 2,
                title: "custom hooks",
                sheet: [
                    {
                        id: 3,
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
        id: 2,
        category: "typescript",
        language: "ts",
        subcategory: [
            {
                id: 3,
                title: "utility types",
                sheet: [
                    {
                        id: 4,
                        shortName: "Partial<T>",
                        description: "Делает все свойства типа необязательными.",
                        code: `interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nfunction updateUser(id: number, fieldsToUpdate: Partial<User>) {\n  return { id, ...fieldsToUpdate };\n}`,
                    },
                    {
                        id: 5,
                        shortName: "Pick<T, K>",
                        description: "Создает тип, выбирая набор свойств K из типа T.",
                        code: `interface Todo {\n  id: number;\n  title: string;\n  completed: boolean;\n}\n\ntype TodoPreview = Pick<Todo, "title" | "completed">;\n\nconst todo: TodoPreview = {\n  title: "Купить молоко",\n  completed: false\n};`,
                    },
                ],
            },
            {
                id: 4,
                title: "generics",
                sheet: [
                    {
                        id: 6,
                        shortName: "Generic Functions",
                        description: "Компоненты, способные работать с различными типами, а не с одним единственным.",
                        code: `function identity<T>(arg: T): T {\n  return arg;\n}\n\nconst output1 = identity<string>("myString");\nconst output2 = identity<number>(100);`,
                    },
                ],
            },
        ],
    },
];

// Создаем таблицы с внешними ключами для связей
db.prepare(
    `
   CREATE TABLE IF NOT EXISTS elements (
       id INTEGER PRIMARY KEY,
       category TEXT NOT NULL,
       language TEXT
    )
`,
).run();

db.prepare(
    `
   CREATE TABLE IF NOT EXISTS subcategories (
       id INTEGER PRIMARY KEY,
       element_id INTEGER,
       title TEXT NOT NULL,
       FOREIGN KEY (element_id) REFERENCES elements (id) ON DELETE CASCADE
    )
`,
).run();

db.prepare(
    `
   CREATE TABLE IF NOT EXISTS sheets (
       id INTEGER PRIMARY KEY,
       subcategory_id INTEGER,
       shortName TEXT,
       description TEXT,
       code TEXT,
       FOREIGN KEY (subcategory_id) REFERENCES subcategories (id) ON DELETE CASCADE
    )
`,
).run();

async function initData() {
    // Подготавливаем три разных SQL-запроса на вставку
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

    // Используем транзакцию, чтобы все записалось быстро и безопасно
    const transaction = db.transaction(() => {
        for (const element of ELEMENTS_LIST) {
            // 1. Сохраняем сам элемент
            insertElement.run({
                id: element.id,
                category: element.category,
                language: element.language || null,
            });

            // Если у элемента есть подкатегории, перебираем их
            if (element.subcategory) {
                for (const sub of element.subcategory) {
                    // 2. Сохраняем подкатегорию, привязывая её к id элемента
                    insertSubcategory.run({
                        id: sub.id,
                        element_id: element.id,
                        title: sub.title,
                    });

                    // Если в подкатегории есть шпаргалки, перебираем их
                    if (sub.sheet) {
                        for (const sh of sub.sheet) {
                            // 3. Сохраняем шпаргалку, привязывая её к id подкатегории
                            insertSheet.run({
                                id: sh.id,
                                subcategory_id: sub.id,
                                shortName: sh.shortName || null,
                                description: sh.description || null,
                                code: sh.code || null,
                            });
                        }
                    }
                }
            }
        }
    });

    // Запускаем процесс
    transaction();
    console.log("Данные успешно импортированы!");
}

initData();
