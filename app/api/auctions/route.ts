import { getAllAuctions } from "@/services/auction-service";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const auctions = await getAllAuctions(
        Object.fromEntries(searchParams.entries()),
    );
    return Response.json(auctions);
}
