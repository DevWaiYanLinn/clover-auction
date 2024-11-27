import { parseError } from "@/lib/exception";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import { z } from "zod";
import { createAuctionByItemId } from "@/services/item-service";
import { CreateAuctionSchema } from "@/validation/auction-schema";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const formData = await request.formData();
    const validatedFields = await CreateAuctionSchema.spa(
        Object.fromEntries(formData.entries()),
    );
    if (!validatedFields.success) {
        return Response.json(
            {
                info: validatedFields.error.flatten().fieldErrors,
            },
            { status: 422 },
        );
    }
    const id = (await params).id;
    try {
        const result = await createAuctionByItemId(
            Number(id),
            validatedFields.data,
        );
        return Response.json(result, { status: 200 });
    } catch (error) {
        const [data, init] = parseError(error);
        return Response.json(data, init);
    }
}
