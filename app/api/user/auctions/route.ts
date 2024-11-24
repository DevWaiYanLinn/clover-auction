import { auth } from "@/lib/session";
import { getAllAuctionsByUser } from "@/services/auction-service";

export async function GET() {
    const session = await auth();
    const auctions = await getAllAuctionsByUser(session!.user.id);
    return Response.json(auctions, { status: 200 });
}
