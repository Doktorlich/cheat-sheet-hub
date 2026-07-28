import classes from "./page.module.css";
import { Metadata } from "next";
import CheatSheetList from "@/app/components/sheet/CheatSheetList";
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

    return (
        <main className={classes.container}>
            <h1 className={classes.h1}>{sheetSlug}</h1>
            <Link href={"/.."} className={classes["link-back"]}>
                Back
            </Link>

            <CheatSheetList sheetSlug={sheetSlug} />
        </main>
    );
}
