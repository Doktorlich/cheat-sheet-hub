"use client";

import classes from "./CategorySelector.module.css";
import React, { useState } from "react";
import { ICategory, ICategoryCheatSheet, Mode, Sheet } from "@/app/lib/types/type-db";

interface CategorySelectorProps {
  categories: ICategory[];
  initialData?: ICategoryCheatSheet;
  mode: Mode;
}

export default function CategorySelector({ mode, initialData, categories }: CategorySelectorProps) {
  const isEdit = mode === "edit" && initialData;

  const [isSelectOther, setIsSelectOther] = useState<string>(
    isEdit && initialData.elementId ? initialData.elementId : "other",
  );
  const [isSelectSubOther, setIsSelectSubOther] = useState<string>(
    isEdit && initialData.subcategoryId ? initialData.subcategoryId : "other",
  );

  const currentCategoryData = categories.find(sheet => sheet.id === isSelectOther);

  function handleSelectOption(e: React.ChangeEvent<HTMLSelectElement>): void {
    setIsSelectOther(e.target.value);
    setIsSelectSubOther("other");
  }

  function handleSelectSubOption(e: React.ChangeEvent<HTMLSelectElement>): void {
    setIsSelectSubOther(e.target.value);
  }


  return (
    <>
      {/*При выборе в select "Other", должно показываться поле input куда нужно ввести новое имя категории*/}
      <label htmlFor="category">
        take category
        {/*Нужно учесть, что при выборе Other категории нужно валидировать, что бы не создавалась категория Other*/}
        <select name="category" id="category" value={isSelectOther} onChange={e => handleSelectOption(e)}>
          <option value={"other"}>other...</option>
          {categories.map(sheet => {
            return (
              <option key={sheet.id} value={sheet.id}>
                {sheet.category}
              </option>
            );
          })}
        </select>
      </label>
      <label htmlFor="new-category" className={isSelectOther === "other" ? classes.visible : classes.invisible}>
        new category*
        <input type="text" name={"new-category"} id={"new-category"} placeholder={"new category"} />
      </label>

      <label htmlFor="subcategory">
        take subcategory
        {/*Нужно учесть, что при выборе Other категории нужно валидировать, что бы не создавалась категория Other*/}
        <select
          name="subcategory"
          id="subcategory"
          value={isSelectSubOther}
          // disabled={!isSelectOther || isSelectOther === "other"}
          onChange={e => handleSelectSubOption(e)}
        >
          <option value={"other"}>other...</option>
          {currentCategoryData?.subcategory?.map(sub => {
            return (
              <option key={sub.id} value={sub.id}>
                {sub.title}
              </option>
            );
          })}
        </select>
      </label>
      <label htmlFor="new-subcategory" className={isSelectSubOther === "other" ? classes.visible : classes.invisible}>
        new subcategory*
        <input type="text" name={"new-subcategory"} id={"new-subcategory"} placeholder={"new subcategory"} />
      </label>
    </>
  );
}
