import { parseError } from "@/lib/exception";
import { buyoutByAuctionId } from "@/services/bid-service";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;
    try {
        const result = await buyoutByAuctionId(Number(id));
        return Response.json(result, { status: 200 });
    } catch (error: unknown) {
        const [data, init] = parseError(error);
        return Response.json(data, init);
    }
}
