import classes from "./page.module.css";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSheet } from "@/app/lib/actions";
import { ELEMENTS_LIST, subcategory } from "@/app/lib/mockData";
import Subcategories from "@/app/components/categories/Subcategories";

type Props = {
    params: Promise<{ sheetSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { sheetSlug } = await params;
    return { title: `Post ${sheetSlug}` };
}

export default async function SheetPage({ params }: Props) {
    const { sheetSlug } = await params;
    const cheatSheet = getSheet(sheetSlug);
    if (!cheatSheet) {
        notFound();
    }

    return (
        <main className={classes.container}>
            <h1 className={classes.h1}>{sheetSlug}</h1>

            <Subcategories sheetSlug={sheetSlug} />
        </main>
    );
}
