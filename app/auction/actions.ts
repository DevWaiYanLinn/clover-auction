"use server";
import prisma from "@/database/prisma";
import { getServerSession } from "@/lib/session";
import { AuctionStatus, type Auction } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import z from "zod";

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
            message: string;
        };
        success: boolean;
    },
    formData: FormData,
) => {
    const bid = formData.get("bid");

    const validatedFields = bidSchema.safeParse({ bid });

    try {
        if (!validatedFields.success) {
            throw new Error(
                validatedFields.error.flatten().fieldErrors.bid![0],
            );
        }

        const data = validatedFields.data;

        const found = await prisma.auction.findUnique({
            where: {
                itemId,
            },
            select: {
                id: true,
                status: true,
                startTime: true,
                endTime: true,
                currentBid: true,
                updatedAt: true,
            },
        });

        if (!found) {
            throw new Error("Auction Not found");
        }

        if (found.status !== AuctionStatus.OPEN) {
            throw new Error("Auction is not opening.");
        }

        const currentBid = Number(found.currentBid);

        const session = await getServerSession();

        if (!session) {
            throw new Error(`Session Expired`);
        }

        if (data.bid < currentBid + (5 / 100) * currentBid) {
            return {
                data: null,
                success: false,
                errors: {
                    message: `Current bid must be greater than previous bid(${data.bid}) plus or 5 % of previous bid.`,
                },
            };
        }

        const result = await prisma.$transaction(async () => {
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
                errors: {
                    message: "",
                },
            };
        });
        return result;
    } catch (error: unknown) {
        return {
            data: null,
            success: false,
            errors: {
                message:
                    error instanceof Error ? error.message : "unknown Error",
            },
        };
    }
};
