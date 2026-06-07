"use client";

import classes from "./CategorySelector.module.css";
import React, { useState } from "react";
import { ICategory } from "@/app/lib/types/type-db";

interface CategorySelectorProps {
    categories: ICategory[];
}

export default function CategorySelector({ categories }: CategorySelectorProps) {
    const [isSelectOther, setIsSelectOther] = useState<string>("other");
    const [isSelectSubOther, setIsSelectSubOther] = useState<string>("other");

    function handleSelectOption(e: React.ChangeEvent<HTMLSelectElement>): void {
        setIsSelectOther(e.target.value);
        setIsSelectSubOther("other");
    }

    function handleSelectSubOption(e: React.ChangeEvent<HTMLSelectElement>): void {
        setIsSelectSubOther(e.target.value);
    }

    const currentCategoryData = categories.find(sheet => sheet.id === isSelectOther);


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
            <label
                htmlFor="new-subcategory"
                className={isSelectSubOther === "other" ? classes.visible : classes.invisible}
            >
                new subcategory*
                <input type="text" name={"new-subcategory"} id={"new-subcategory"} placeholder={"new subcategory"} />
            </label>
        </>
    );
}
