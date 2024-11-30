import CreateItem from "@/components/custom/create-item";
import Modal from "@/components/custom/modal";
import { getAllCategories } from "@/services/user/category-service";

export default async function ItemModal() {
    const categories = await getAllCategories();
    return (
        <Modal>
            <CreateItem categories={categories} />
        </Modal>
    );
}
