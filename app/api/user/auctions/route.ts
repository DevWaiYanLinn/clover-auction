import { getAllAuctionsByUser } from "@/services/user/auction-service";
import { parseError } from "@/lib/exception";

export async function GET() {
    try {
        const auctions = await getAllAuctionsByUser();
        return Response.json(auctions, { status: 200 });
    } catch (error) {
        const [data, init] = parseError(error);
        return Response.json(data, init);
    }
}
