import classes from "./page.module.css";
import Link from "next/link";

import CategorySelector from "@/app/components/builder/CategorySelector";
import { ICategory } from "@/app/lib/types/type-db";
import { getAllCategoriesData } from "@/app/lib/cheatSheet";
import BuilderForm from "@/app/components/builder/BuilderForm";
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
            <BuilderForm>
                <Suspense fallback={<p className={classes.loading}>Fetching categories...</p>}>
                    <Categories />
                </Suspense>
            </BuilderForm>
        </>
    );
}
