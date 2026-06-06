import classes from "./page.module.css";
import "./globals.css";

import Link from "next/link";
import { getCategories } from "@/app/lib/cheatSheet";
import CategoriesList from "@/app/components/home/CategoriesList";
import { ICategory } from "@/app/lib/types/type-db";
import { Suspense } from "react";

async function Categories() {
    const categories: ICategory[] = await getCategories();
    return <CategoriesList categories={categories} />;
}

export default function Home() {
    return (
        <>
            <div className={classes.builder}>
                <Link href={"/builder"}>Builder cheat sheet</Link>
            </div>
            <section className={classes.section}>
                <div className={classes.container}>
                    {/* ПОИСК ПОКА НЕ РЕАЛИЗОВАНО*/}
                    <div className={classes.search}>
                        <form action="">
                            <label htmlFor="search">Search</label>
                            <input type="search" id={"search"} placeholder={"Input the text"} />
                        </form>
                    </div>
                    <Suspense fallback={<p className={classes.loading}>Fetching meals...</p>}>
                        <Categories />
                    </Suspense>
                </div>
            </section>
        </>
    );
}
