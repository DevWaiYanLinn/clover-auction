import { auth } from "@/lib/session";
import { getAllBidByUser } from "@/services/bid-service";

export async function GET(request: Request) {
    const session = (await auth())!;
    const user = await getAllBidByUser(session.user.id);
    return Response.json(user, { status: 200 });
}
