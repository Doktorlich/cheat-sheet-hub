import classes from "./page.module.css";
import "./globals.css";

import Link from "next/link";
import { getCategories } from "@/app/lib/cheatSheet";
import CategoriesList from "@/app/components/home/CategoriesList";
import { ICategory } from "@/app/lib/types/type-db";
import { Suspense } from "react";
import CategoriesSearch from "@/app/components/home/CategoriesSearch";

async function Categories() {
  const categories: ICategory[] = await getCategories();
  return <CategoriesSearch categories={categories} />; // вместо CategoriesList напрямую
}

export default function Home() {
    return (
        <>
            <div className={classes.builder}>
                <Link href={"/builder?mode=create"}>Builder cheat sheet</Link>
            </div>
            <section className={classes.section}>
                <div className={classes.container}>
                    <Suspense fallback={<p className={classes.loading}>Fetching meals...</p>}>
                        <Categories />
                    </Suspense>
                </div>
            </section>
        </>
    );
}
