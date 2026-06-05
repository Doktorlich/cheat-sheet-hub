export type sheet = {
    shortName?: string;
    description?: string;
    code?: string;
};

// Новый тип для подкатегорий (hooks, custom hooks)
export type subcategory = {
    title: string;
    sheet: sheet[];
};

export type element = {
    id?: string | number;
    category?: string;
    language?: string;
    shortName?: string;
    description?: string;
    // Заменили старый sheet?: sheet[] на массив подкатегорий
    subcategory?: subcategory[];
};

export const ELEMENTS_LIST: element[] = [
    {
        id: 1,
        category: "react",
        language: "jsx",
        subcategory: [
            {
                title: "hooks",
                sheet: [
                    {
                        shortName: "useState()",
                        description: "Базовый хук для управления локальным состоянием в функциональных компонентах.",
                        code: `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div className="p-4 card">
      <p>Вы кликнули {count} раз</p>
      <button onClick={handleClick}>
        Нажми на меня
      </button>
    </div>
  );
}`,
                    },
                    {
                        shortName: "useRef()",
                        description:
                            "Хук для создания изменяемого объекта, который сохраняется на весь жизненный цикл компонента и не вызывает рендеринг при изменении.",
                        code: `import React, { useRef } from 'react';

export default function FocusInput() {
  const inputRef = useRef(null);
  
  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div className="p-4 card">
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>
        Фокус на инпут
      </button>
    </div>
  );
}`,
                    },
                ],
            },
            {
                title: "custom hooks",
                sheet: [
                    {
                        shortName: "useDebounce()",
                        description:
                            "Хук задерживает обновление значения до истечения указанного времени, снижая частоту запросов или тяжелых рендеров.",
                        code: `// useDebounce.ts
import { useState, useEffect } from "react";

export default function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}


// SearchInput.tsx
import { useState, useEffect } from "react";
import useDebounce from "./useDebounce";

export default function SearchInput() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearch) {
      console.log("Запрос к API для:", debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Поиск..."
    />
  );
}`,
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        category: "ts",
        language: "typescript",
        subcategory: [
            {
                title: "utility types",
                sheet: [
                    {
                        shortName: "Partial<T>",
                        description: "Делает все свойства типа необязательными.",
                        code: `interface User {
  id: number;
  name: string;
  email: string;
}

function updateUser(id: number, fieldsToUpdate: Partial<User>) {
  return { id, ...fieldsToUpdate };
}`,
                    },
                    {
                        shortName: "Pick<T, K>",
                        description: "Создает тип, выбирая набор свойств K из типа T.",
                        code: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Купить молоко",
  completed: false
};`,
                    },
                ],
            },
            {
                title: "generics",
                sheet: [
                    {
                        shortName: "Generic Functions",
                        description: "Компоненты, способные работать с различными типами, а не с одним единственным.",
                        code: `function identity<T>(arg: T): T {
  return arg;
}

const output1 = identity<string>("myString");
const output2 = identity<number>(100);`,
                    },
                ],
            },
        ],
    },

    { id: 3, category: "next.js" },
    { id: 4, category: "js" },
    { id: 5, category: "git" },
    { id: 6, category: "html" },
    { id: 7, category: "css" },
    { id: 8, category: "node.js" },
    { id: 9, category: "nestjs" },
    { id: 10, category: "express" },
];
