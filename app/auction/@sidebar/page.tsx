import Category from "@/components/custom/category";
import PreRenderCategory from "./pre-render-category";
import { getAllCategories } from "@/app/category/actions";
export const experimental_ppr = true;
export default async function Page() {
    const categories = await getAllCategories();
    return (
        <PreRenderCategory categories={categories}>
            <Category />
        </PreRenderCategory>
    );
}
