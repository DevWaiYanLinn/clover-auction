"use server";
import prisma from "@/database/prisma";
import { getServerSession } from "@/lib/session";
import type { Auction } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { cache } from "react";
import z from "zod";

type Status = "OPEN" | "CLOSED" | "FINISHED";

export const getAllAuctions = cache(
    async ({
        subcategory,
        name,
        status,
    }: {
        [key: string]: string | string[] | undefined;
    } = {}) => {
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

const bidSchema = z.object({
    bid: z
        .string({ required_error: "Invalid Input" })
        .regex(/^\d+(\.\d+)?$/, "Invalid Input")
        .transform(Number),
});

export const bidAuction = async (
    itemId: number,
    prev: {
        data: Auction | null;
        errors: {
            message?: string;
        };
        success: boolean;
    },
    formData: FormData,
) => {
    const bid = formData.get("bid");

    const validatedFields = bidSchema.safeParse({ bid });

    if (!validatedFields.success) {
        return {
            data: null,
            success: false,
            errors: {
                message: validatedFields.error.flatten().fieldErrors.bid![0],
            },
        };
    }
    const data = validatedFields.data;

    const found = await prisma.auction.findUnique({
        where: {
            itemId,
        },
        select: {
            id: true,
            status: true,
            currentBid: true,
            updatedAt: true,
        },
    });

    if (!found) {
        return {
            data: null,
            success: false,
            errors: {
                message: "Auction Not found",
            },
        };
    }

    const session = await getServerSession();

    if (found?.status !== "OPEN") {
        return {
            data: null,
            success: false,
            errors: {
                message: "Auction is not opening.",
            },
        };
    }

    const currentBid = Number(found.currentBid);

    if (data.bid < (5 / 100) * currentBid) {
        return {
            data: null,
            success: false,
            errors: {
                message:
                    "Current bid must be greater than previous bid plus or 5 % of previous bid.",
            },
        };
    }

    const updated = await prisma.$transaction(async () => {
        try {
            const auction = await prisma.auction.update({
                where: {
                    id: found.id,
                    updatedAt: found.updatedAt,
                },
                data: {
                    currentBid: new Decimal(data.bid),
                },
            });

            if (!auction) {
                throw new Error(`Auction Bid failed`);
            }

            if (!session) {
                throw new Error(`Session Expired`);
            }

            await prisma.bid.create({
                data: {
                    userId: session.user.id,
                    amount: auction.currentBid!,
                    auctionId: auction.id,
                },
            });

            return {
                data: JSON.parse(JSON.stringify(auction)),
                success: true,
                errors: {},
            };
        } catch (error: unknown) {
            return {
                data: null,
                success: false,
                errors: {
                    message:
                        error instanceof Error
                            ? error.message
                            : "unknown Error",
                },
            };
        }
    });
    return updated;
};
