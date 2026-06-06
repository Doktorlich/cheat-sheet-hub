import classes from "./CategoriesList.module.css";
import Link from "next/link";
import { ICategory } from "../../lib/types/type-db";

interface CategoryListProps {
    categories: ICategory[] | [];
}

export default function CategoriesList({ categories }: CategoryListProps) {
    return (
        <div className={classes["stacks-list"]}>
            <ul>
                {categories
                    .map(sheet => {
                        return (
                            <li key={sheet.id}>
                                <Link href={`/${sheet.category}`}>
                                    <h3>{sheet.category}</h3>
                                </Link>
                            </li>
                        );
                    })
                    .sort()}
            </ul>
        </div>
    );
}
