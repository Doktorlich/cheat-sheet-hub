import classes from "./page.module.css";
import Link from "next/link";

import CategorySelector from "@/app/components/builder/CategorySelector";
import { ICategory } from "@/app/lib/types/type-db";
import { getAllCategoriesData } from "@/app/lib/cheatSheet";
import { Suspense } from "react";

async function Categories() {
    const categories: ICategory[] = await getAllCategoriesData();
    return <CategorySelector categories={categories} />;
}

export default function BuilderPage() {
    return (
        <>
            <Link href={"/.."}>Back</Link>
            <h1 className={classes.h1}>Builder Page</h1>
            <form className={classes["form-builder"]} action="">
                <Suspense fallback={<p className={classes.loading}>Fetching categories...</p>}>
                    <Categories />
                </Suspense>
                <label htmlFor="short-name">
                    short name
                    <input type="text" name={"short-name"} id={"short-name"} placeholder={"enter a short name"} />
                </label>

                <label htmlFor="code-block">
                    code block
                    <textarea name={"code-block"} id="code-block" cols={30} rows={10} />
                </label>

                <label htmlFor="description">
                    description
                    <textarea name={"description"} id="description" cols={30} rows={10} />
                </label>

                <div className={classes["list-button"]}>
                    <button type={"submit"}>submit</button>
                    <button type={"button"}>clear</button>
                </div>
            </form>
        </>
    );
}
