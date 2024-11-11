import { getAllItem } from "@/services/item-service";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const items = await getAllItem();
    return Response.json(items);
}
