type element = {
    id?: string | number;
    category?: string;
    titleSheet?: string;
    shortName?: string;
    blockCode?: string;
    description?: string;
};
export const ELEMENTS_LIST: element[] = [
    {
        id: 1,
        category: "react",
        titleSheet: "Хук useState",
        shortName: "useState()",
        blockCode: `
import React, { useState } from 'react';
export default function Counter() {
  // Инициализируем состояние нуля
  const [count, setCount] = useState(0);

  // Обработчик клика для увеличения счетчика
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
        description: "Базовый хук для управления локальным состоянием в функциональных компонентах.",
    },
    { id: 2, category: "ts" },
    { id: 3, category: "next.js" },
    { id: 4, category: "js" },
    { id: 5, category: "git" },
    { id: 6, category: "html" },
    { id: 7, category: "css" },
    { id: 8, category: "node.js" },
    { id: 9, category: "nestjs" },
    { id: 10, category: "express" },
];
