import { getAllAuctions } from "@/services/auction-service";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const paramsToObj = Object.fromEntries(searchParams.entries());
    const auctions = await getAllAuctions(paramsToObj);
    return Response.json(auctions);
}
