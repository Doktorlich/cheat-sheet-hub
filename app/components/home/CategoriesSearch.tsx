"use client";
import { useState, useMemo } from "react";
import SearchForm from "@/app/components/home/SearchForm";
import CategoriesList from "@/app/components/home/CategoriesList";
import { ICategory } from "@/app/lib/types/type-db";

export default function CategoriesSearch({ categories }: { categories: ICategory[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return categories;
    const lower = query.toLowerCase();
    return categories.filter(c => c.category.toLowerCase().includes(lower));
  }, [categories, query]);

  return (
    <>
      <SearchForm onSearch={setQuery} />
      <CategoriesList categories={filtered} />
    </>
  );
}
