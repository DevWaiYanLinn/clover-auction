import { type NextRequest } from "next/server";
import { getAllCategories } from "../actions";

export async function GET(request: NextRequest) {
    const categories = await getAllCategories();
    return Response.json(categories);
}
