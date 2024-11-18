"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const{ replace } = useRouter();
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathName}?${params.toString()}`);
  }
  return (
    <div className="w-fit bg-transparent">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search...
      </label>
      <input
        className="p-2 rounded-lg dark:bg-neutral-100 bg-black dark:text-black text-blue-50"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}
