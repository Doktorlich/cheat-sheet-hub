import classes from "./page.module.css";
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

export default function BuilderPage() {
    return (
        <>
            <Link href={"/.."}>Back</Link>
            <h1>Builder Page</h1>
            <form className={classes["form-builder"]} action="">
                <label htmlFor="category">
                    take category
                    {/*Нужно учесть, что при выборе Other категории нужно валидировать, что бы не создавалась категория Other*/}
                    <select name="category" id="category">
                        {ELEMENT_LIST.map(sheet => {
                            return (
                                <option key={sheet.id} value={sheet.category}>
                                    {sheet.category}
                                </option>
                            );
                        })}
                        <option value={"other"}>other...</option>
                    </select>
                </label>
                {/*При выборе в select "Other", должно показываться поле input куда нужно ввести новое имя категории*/}
                <label htmlFor="new-category">
                    new stack
                    <input type="text" name={"new-category"} id={"new-category"} placeholder={"new category"} />
                </label>

                <label htmlFor="short-name">
                    short name
                    <input type="text" name={"short-name"} id={"short-name"} placeholder={"enter a short name"} />
                </label>

                <label htmlFor="code-block">
                    code block
                    <textarea name={"code-block"} id="code-block" cols="30" rows="10" />
                </label>

                <label htmlFor="description">
                    description
                    <textarea name={"description"} id="description" cols="30" rows="10" />
                </label>

                <div className={classes["list-button"]}>
                    <button type={"submit"}>submit</button>
                    <button type={"button"}>clear</button>
                </div>
            </form>
        </>
    );
}
