import CreateItem from "@/components/custom/create-item";
import { getAllCategories } from "@/services/user/category-service";

export default async function Page() {
    const categories = await getAllCategories();
    return (
        <div className="h-full justify-center items-center flex">
            <CreateItem categories={categories} />
        </div>
    );
}
