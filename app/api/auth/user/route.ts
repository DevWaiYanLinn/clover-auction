import { auth } from "@/lib/session";
import { getUserById } from "@/services/user-service";

export async function GET() {
    const session = await auth();
    const user = await getUserById(session!.user.id);
    return Response.json(user, { status: 200 });
}
