import { getAllAuctions } from "@/services/user/auction-service";
import { type NextRequest } from "next/server";
import { parseError } from "@/lib/exception";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const paramsToObj = Object.fromEntries(searchParams.entries());
        const auctions = await getAllAuctions(paramsToObj);
        return Response.json(auctions, { status: 200 });
    } catch (error) {
        const [data, init] = parseError(error);
        return Response.json(data, init);
    }
}
