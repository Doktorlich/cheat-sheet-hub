export type Mode = "build" | "edit";

export type Sheet = {
    id: string;
    shortName: string;
    description: string;
    code: string;
};

export interface ICategoryCheatSheet {
  elementId?: string;
  subcategoryId?: string;
  sheetId?: string;
  category?: string;
  title?: string;
  shortName?: string;
  description?: string;
  code?: string;
};

// Новый тип для подкатегорий (hooks, custom hooks)
export type Subcategory = {
    id: string;
    title: string;
    sheet: Sheet[];
};

export interface ICategory {
    id: string;
    category: string;
    language?: string;
    shortName: string;
    description: string;
    // Заменили старый sheet?: sheet[] на массив подкатегорий
    subcategory: Subcategory[];


}
