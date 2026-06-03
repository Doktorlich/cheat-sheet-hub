import classes from "./page.module.css";
import "./globals.css";

import Link from "next/link";
import { ELEMENTS_LIST } from "@/app/lib/mockData";


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
                            {ELEMENTS_LIST.map(sheet => {
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
