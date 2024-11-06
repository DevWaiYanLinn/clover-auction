"use server";
import prisma from "@/database/prisma";
import { cache } from "react";

export const getAllAuctions = cache(async () => {
    return prisma.auction.findMany({
        where: {
            status: process.env.NODE_ENV === "production" ? "OPEN" : "CLOSED",
        },
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
