import { parseError } from "@/lib/exception";
import { NextRequest } from "next/server";
import { bidByAuctionId } from "@/services/bid-service";
import { AuctionBidSchema } from "@/validation/auction-schema";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const body = await request.json();
    const validatedFields = await AuctionBidSchema.spa(body);
    if (!validatedFields.success) {
        return Response.json(
            {
                info: {
                    message:
                        validatedFields.error.flatten().fieldErrors.amount![0],
                },
            },
            { status: 422 },
        );
    }
    const id = (await params).id;
    try {
        const result = await bidByAuctionId(
            Number(id),
            validatedFields.data.amount,
        );
        return Response.json(result, { status: 200 });
    } catch (error) {
        const [detail, init] = parseError(error);
        return Response.json(detail, init);
    }
}
