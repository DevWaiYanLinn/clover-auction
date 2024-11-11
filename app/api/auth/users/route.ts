import { getSession } from "@/lib/session";
import { getAuthUser } from "@/services/user-service";

export async function GET() {
    const session = await getSession();
    const user = await getAuthUser(session!.user.id);
    return Response.json(user, { status: 200 });
}
