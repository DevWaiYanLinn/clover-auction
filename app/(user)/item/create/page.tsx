import { getAllCategories } from "@/app/category/actions";
import CreateItem from "@/components/custom/CreateItem";

export default async function Page() {
    const categories = await getAllCategories();
    return (
        <div className="h-full justify-center items-center flex">
            <CreateItem categories={categories} />;
        </div>
    );
}
