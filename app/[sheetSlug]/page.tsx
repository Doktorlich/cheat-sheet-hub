import classes from "./page.module.css";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSheet } from "@/app/lib/actions";
// Импортируем новый тип subcategory вместо старого sheet
import { ELEMENTS_LIST, subcategory } from "@/app/lib/mockData";
import CodeBlock from "@/app/components/builder/CodeBlock";

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

    const [sheetFirstElem] = ELEMENTS_LIST.filter(e => e.category === sheetSlug);
    // Достаем массив подкатегорий subcategory вместо старого sheet
    const subcategories: subcategory[] | undefined = sheetFirstElem.subcategory;

    if (!subcategories) {
        throw new Error("subcategories not found");
    }

    return (
        <main className={classes.container}>
            <h1 className={classes.h1}>{sheetSlug}</h1>

            {/* 1-й MAP: Перебираем блоки подкатегорий (hooks, custom hooks) */}
            {subcategories.map(sub => {
                return (
                    <section key={sub.title} className={classes.section}>
                        <h2 className={classes.subcategoryTitle}>{sub.title}</h2>

                        <ul className={classes["sheets-list"]}>
                            {/* 2-й MAP: Перебираем карточки внутри текущей подкатегории */}
                            {sub.sheet.map(item => {
                                return (
                                    <li key={item.shortName}>
                                        <h3>{item.shortName}</h3>
                                        <div className={classes["code-block"]}>
                                            <div className={classes.code}>
                                                <CodeBlock code={String(item.code)} language={"jsx"} />
                                                <button type={"button"}></button>
                                            </div>
                                        </div>
                                        <p>{item.description}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                );
            })}
        </main>
    );
}
