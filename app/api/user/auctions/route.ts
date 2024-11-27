import { auth } from "@/lib/session";
import { getAllAuctionsByUserId } from "@/services/auction-service";

export async function GET() {
    const session = await auth();
    if (!session) {
        return Response.json(
            {
                info: {
                    message: "Authentication error.",
                },
            },
            { status: 401 },
        );
    }
    const auctions = await getAllAuctionsByUserId(session.user.id);
    return Response.json(auctions, { status: 200 });
}
