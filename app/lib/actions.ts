import { ELEMENTS_LIST } from "@/app/lib/mockData";

export function getSheet(sheetSlug: string) {
    const isSheet = ELEMENTS_LIST.some(elem => elem.category === sheetSlug);
    return isSheet;
}
