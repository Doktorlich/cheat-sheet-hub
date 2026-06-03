import classes from "./SheetPage.module.css";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSheet } from "@/app/lib/actions";

type Props = {
    params: Promise<{ sheetSlug: string }>;
};



export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { sheetSlug } = await params;
    return { title: `Post ${sheetSlug}` };
}

export default async function SheetPage({ params }: Props) {
    const { sheetSlug } = await params;
    const sheet = getSheet(sheetSlug)
    if (!sheet){
        notFound()
    }
    return <>{sheetSlug}</>;
}
