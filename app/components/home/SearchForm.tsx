"use client";
import { useDebounce } from "@/app/hooks/debaunce";

interface SearchFormProps {
  onSearch: (query: string) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const debouncedSearch = useDebounce(onSearch, 300);

  return (
    <form action="" onSubmit={e => e.preventDefault()}>
      <label htmlFor="search">Search</label>
      <input type="search" id="search" placeholder="Input the text" onChange={e => debouncedSearch(e.target.value)} />
    </form>
  );
}
