import { auth } from "@/lib/session";
import { getAllBidsByUserId } from "@/services/bid-service";

export async function GET(request: Request) {
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
    const user = await getAllBidsByUserId(session.user.id);
    return Response.json(user, { status: 200 });
}
