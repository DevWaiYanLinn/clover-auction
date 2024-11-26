import { createItem, getAllItems } from "@/services/item-service";
import { type NextRequest } from "next/server";
import { parseError } from "@/lib/exception";
import { CreateItemSchema } from "@/validation/item-schema";

export async function GET(request: NextRequest) {
    const items = await getAllItems();
    return Response.json(items, { status: 200 });
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const validatedFields = await CreateItemSchema.spa({
        name: formData.get("name"),
        subcategory: formData.get("subcategory"),
        description: formData.get("description"),
        photo: formData.get("photo"),
    });

    if (!validatedFields.success) {
        return Response.json(
            {
                info: validatedFields.error.flatten().fieldErrors,
            },
            { status: 200 },
        );
    }

    try {
        const result = await createItem(validatedFields.data);
        return Response.json(result, { status: 200 });
    } catch (error: unknown) {
        const [detail, init] = parseError(error);
        return Response.json(detail, init);
    }
}
