import { auth } from "@/lib/session";
import { getAllBidsByUser } from "@/services/bid-service";

export async function GET(request: Request) {
    const session = (await auth())!;
    const user = await getAllBidsByUser(session.user.id);
    return Response.json(user, { status: 200 });
}
