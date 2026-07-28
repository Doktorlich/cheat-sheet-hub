import CodeBlock from "@/app/components/sheet/CodeBlock";
import classes from "./CheatSheetList.module.css";
import ButtonCopy from "@/app/components/sheet/ButtonCopy";
import { getCategory } from "@/app/lib/cheatSheet";
import { ICategory, Subcategory } from "@/app/lib/types/type-db";
import Link from "next/link";

interface CheatSheetListProps {
  sheetSlug: string;
}

export default async function CheatSheetList({ sheetSlug }: CheatSheetListProps) {
  const categories: ICategory = await getCategory(sheetSlug);
  const subcategories: Subcategory[] = categories.subcategory;

  if (!subcategories) {
    throw new Error("subcategories not found");
  }

  return (
    <>
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
                        <ButtonCopy inputCode={item.code!} />
                      </div>
                    </div>
                    <p>{item.description}</p>
                    {/*Кнопка которая в будущем будет запускать редактирование конкретной заметки
                                          <button className={classes.edit} type={"button"} onClick={()=>handleEditCheatSheet(item.id)}>edit</button>
                                        */}
                    <Link href={`/builder?mode=edit&id=${item.id}`}>
                      <button className={classes.edit} type={"button"}>
                        Edit
                      </button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </>
  );
}
