import classes from "./SheetPage.module.css";
import { Metadata } from "next";

type Props = {
    params: Promise<{ sheetSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { sheetSlug } = await params;
    return { title: `Post ${sheetSlug}` };
}

export default async function SheetPage({ params }: Props) {
    const { sheetSlug } = await params;
    return <>{sheetSlug}</>;
}
