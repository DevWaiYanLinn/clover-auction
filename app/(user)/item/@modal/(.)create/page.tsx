import { getAllCategories } from "@/app/category/actions";
import CreateItem from "@/components/custom/CreateItem";
import Modal from "@/components/custom/modal";

export default async function ItemModal() {
    const categories = await getAllCategories();
    return (
        <Modal>
            <CreateItem categories={categories} />
        </Modal>
    );
}
