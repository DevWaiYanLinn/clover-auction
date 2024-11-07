"use server";
import prisma from "@/database/prisma";
import { cache } from "react";

export const getAllAuctions = cache(async () => {
    return prisma.auction.findMany({
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
    });
});
