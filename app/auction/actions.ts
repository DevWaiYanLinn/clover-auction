"use server";
import prisma from "@/database/prisma";
import { cache } from "react";

type Status = "OPEN" | "CLOSED" | "FINISHED";

export const getAllAuctions = cache(
    async ({
        subcategory,
        name,
        status,
    }: {
        [key: string]: string | string[] | undefined;
    }) => {
        const filter: {
            item: { subCategoryId?: number; name?: string };
            status?: Status;
        } = {
            item: {},
        };

        if (subcategory && typeof subcategory === "string") {
            filter.item["subCategoryId"] = Number(subcategory);
        }

        if (name && typeof name === "string") {
            filter.item["name"] = name;
        }

        if (
            status &&
            typeof status === "string" &&
            ["OPEN", "CLOSED", "FINISHED"].includes(status)
        ) {
            filter["status"] = status as Status;
        }

        const data = await prisma.auction.findMany({
            include: {
                item: {
                    include: {
                        seller: {
                            select: {
                                name: true,
                                id: true,
                            },
                        },
                    },
                },
            },
            where: filter,
            orderBy: {
                id: "desc",
            },
        });

        return JSON.parse(JSON.stringify(data));
    },
);
