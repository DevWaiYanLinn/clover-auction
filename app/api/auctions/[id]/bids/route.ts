import prisma from "@/database/prisma";
import publisher from "@/database/redis/publisher";
import { HttpError } from "@/lib/exception";
import { getSession } from "@/lib/session";
import { AuctionStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import z from "zod";

const bidSchema = z.object({
    bidAmount: z.number({ required_error: "Bib Amount is required" }),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const body = await request.json();

    const validatedFields = bidSchema.safeParse(body);

    try {
        if (!validatedFields.success) {
            throw new HttpError({
                info: validatedFields.error.flatten().fieldErrors,
                status: 422,
            });
        }

        const id = (await params).id;

        const data = validatedFields.data;

        const found = await prisma.auction.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!found) {
            throw new HttpError({ status: 404 });
        }

        if (found.status !== AuctionStatus.OPEN) {
            throw new HttpError({ status: 403 });
        }

        const session = await getSession();

        if (!session) {
            throw new HttpError({ status: 401 });
        }

        const currentBid =
            Number(found.currentBid) || Number(found.startingPrice);

        if (data.bidAmount < currentBid + (found.increase / 100) * currentBid) {
            throw new HttpError({
                status: 422,
                info: {
                    bidAmount: `Current bid must be greater than previous bid(${currentBid}) plus or 5 % of previous bid.`,
                },
            });
        }

        const result = await prisma.$transaction(async () => {
            const auction = await prisma.auction.update({
                where: {
                    id: found.id,
                    updatedAt: found.updatedAt,
                },
                data: {
                    currentBid: new Decimal(data.bidAmount),
                    userId: session.user.id,
                },
            });

            if (!auction) {
                throw new HttpError({
                    status: 409,
                });
            }

            await prisma.bid.create({
                data: {
                    userId: session.user.id,
                    amount: auction.currentBid!,
                    auctionId: auction.id,
                },
            });

            return auction;
        });
        publisher.publish(
            "bid",
            JSON.stringify({
                user: { id: session.user.id },
                auction: {
                    id: result.id,
                    itemId: result.itemId,
                    currentBid: Number(result.currentBid),
                },
            }),
        );
        return Response.json(result, { status: 200 });
    } catch (error: unknown) {
        console.log(error);
        if (error instanceof HttpError) {
            return Response.json(
                { info: error.info, message: error.message },
                { status: error.status },
            );
        }

        return Response.json(
            { info: {}, message: "unknown Error" },
            { status: 500 },
        );
    }
}
