import { authenticatedUser } from "@/services/user/auth-service";
import { parseError } from "@/lib/exception";

export async function GET() {
    try {
        const user = await authenticatedUser();
        return Response.json(user, { status: 200 });
    } catch (error) {
        const [data, init] = parseError(error);
        return Response.json(data, init);
    }
}
