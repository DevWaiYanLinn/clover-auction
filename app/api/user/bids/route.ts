import { getAllBidsByUser } from "@/services/user/bid-service";
import { parseError } from "@/lib/exception";

export async function GET() {
    try {
        const bids = await getAllBidsByUser();
        return Response.json(bids, { status: 200 });
    } catch (error) {
        const [data, init] = parseError(error);
        return Response.json(data, init);
    }
}
