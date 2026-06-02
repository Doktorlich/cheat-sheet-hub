import classes from "./page.module.css";
import "./globals.css";

import Link from "next/link";
type element = {
    id?: string | number;
    category?: string;
    titleSheet?: string;
};
const ELEMENT_LIST: element[] = [
    { id: 1, category: "git" },
    { id: 2, category: "ts" },
    { id: 3, category: "next.js" },
    { id: 4, category: "js" },
    { id: 5, category: "react" },
    { id: 6, category: "html" },
    { id: 7, category: "css" },
    { id: 8, category: "node.js" },
    { id: 9, category: "nestjs" },
    { id: 10, category: "express" },
];

export default function Home() {
    return (
        <>
            <div className={classes.builder}>
                <Link href={"/builder"}>Builder cheat sheet</Link>
            </div>
            <section className={classes.section}>
                <div className={classes.container}>
                    {/*ПОКА НЕ РЕАЛИЗОВАНО*/}
                    <div className={classes.search}>
                        <form action="">
                            <label htmlFor="search">Search</label>
                            <input type="search" id={"search"} placeholder={"Input the text"} />
                        </form>
                    </div>

                    <div className={classes["stacks-list"]}>
                        <ul>
                            {ELEMENT_LIST.map(sheet => {
                                return (
                                    <li key={sheet.id}>
                                        <Link href={`/${sheet.category}`}>
                                            <h3>{sheet.category}</h3>
                                        </Link>
                                    </li>
                                );
                            }).sort()}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
}
