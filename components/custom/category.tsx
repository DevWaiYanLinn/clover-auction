import { getAllCategories } from "@/app/auction/actions";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const Category = async () => {
    const categories = await getAllCategories();

    return (
        <div className="space-y-3 overflow-y-scroll">
            <Accordion type="single" collapsible className="w-full p-2">
                {categories.map((category) => {
                    return (
                        <AccordionItem
                            key={category.id}
                            value={`item-${category.id}`}
                        >
                            <AccordionTrigger>{category.name}</AccordionTrigger>
                            {category.subcategories.map((s) => {
                                return (
                                    <AccordionContent key={s.id}>
                                        {s.name}
                                    </AccordionContent>
                                );
                            })}
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
};

export default Category;
