import { auctionRankById } from "@/services/user/auction-service";
import { type NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;
    const bids = await auctionRankById(id);
    return Response.json(bids, { status: 200 });
}
