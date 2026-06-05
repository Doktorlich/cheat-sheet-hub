import classes from "./page.module.css";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSheet } from "@/app/lib/actions";
import Subcategories from "@/app/components/sheet/Subcategories";
import Link from "next/link";

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
            <Link href={"/.."}>Back</Link>

            <Subcategories sheetSlug={sheetSlug} />
        </main>
    );
}
