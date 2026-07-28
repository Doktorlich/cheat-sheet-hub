import classes from "./page.module.css";
import Link from "next/link";

import CategorySelector from "@/app/components/builder/CategorySelector";
import { ICategory } from "@/app/lib/types/type-db";
import { getAllCategoriesData, getCheatSheet } from "@/app/lib/cheatSheet";
import BuilderForm from "@/app/components/builder/BuilderForm";
import { Suspense } from "react";
import { notFound } from "next/navigation";


async function Categories({ mode, initialData }: { mode: string; initialData: unknown }) {
  const categories: ICategory[] = await getAllCategoriesData();
  // 2. Передаем пропсы внутрь CategorySelector
  return <CategorySelector categories={categories} mode={mode} initialData={initialData} />;
}

export default async function BuilderPage({searchParams}) {
 const { mode, id } = await searchParams;

  let initialData = null;
  if (mode=== "edit"){
    if (!id){
      notFound()
    }

    initialData = await getCheatSheet(id);

    if (!initialData){
      notFound()
    }

  }

    return (
      <>
        <Link href={"/.."}>Back</Link>

        <BuilderForm initialData={initialData} mode={mode}>
          <Suspense fallback={<p className={classes.loading}>Fetching categories...</p>}>
            <Categories initialData={initialData} mode={mode} />
          </Suspense>
        </BuilderForm>
      </>
    );
}
