import { getAllCategories } from "@/app/category/actions";
import Category from "@/components/custom/category";

export default async function Sidebar() {
    const categories = await getAllCategories();
    return <Category categories={categories} />;
}
