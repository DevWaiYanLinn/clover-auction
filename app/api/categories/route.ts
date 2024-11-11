import { getAllCategories } from "@/services/category-service";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const categories = await getAllCategories();
    return Response.json(categories);
}