import prisma from "@/database/prisma";
import { pub } from "@/database/redis";
import { HttpError } from "@/lib/exception";
import { auth } from "@/lib/session";
import { AuctionStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import z from "zod";

const bidSchema = z.object({
    amount: z.number({ required_error: "Bib Amount is required" }),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const body = await request.json();

    const validatedFields = await bidSchema.spa(body);

    try {
        if (!validatedFields.success) {
            throw new HttpError({
                info: {
                    message:
                        validatedFields.error.flatten().fieldErrors.amount![0],
                },
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
            throw new HttpError({ status: 404, message: "Auction not found." });
        }

        if (found.status !== AuctionStatus.OPEN) {
            throw new HttpError({ status: 403 });
        }

        if (found.userId) {
            throw new HttpError({
                status: 403,
                info: {
                    message:
                        "Auction has already concluded, no more bids can be placed.",
                },
            });
        }

        const currentBid =
            found.currentBid.toNumber() || found.startingPrice.toNumber();

        if (data.amount < currentBid + (found.increase / 100) * currentBid) {
            throw new HttpError({
                status: 422,
                info: {
                    message: `Current bid must be greater than previous bid(${currentBid}) plus or 5 % of previous bid.`,
                },
            });
        }

        const session = await auth();

        if (!session) {
            throw new HttpError({
                status: 401,
                info: {
                    message: "Authentication is required.",
                },
            });
        }

        if (found.userId === session.user.id) {
            throw new HttpError({
                status: 403,
                info: { message: "You can't bid your own auction." },
            });
        }

        const result = await prisma.$transaction(async (tx) => {
            const auction = await tx.auction.update({
                where: {
                    id: found.id,
                    updatedAt: found.updatedAt,
                },
                data: {
                    currentBid: new Decimal(data.amount),
                },
            });

            if (!auction) {
                throw new HttpError({
                    status: 409,
                    message: "Failed to update the auction bid.",
                });
            }

            const bid = await prisma.bid.findFirst({
                where: {
                    auctionId: auction.id,
                    userId: session.user.id,
                },
            });

            if (!bid) {
                await tx.bid.create({
                    data: {
                        userId: session.user.id,
                        amount: auction.currentBid,
                        auctionId: auction.id,
                    },
                });
            } else {
                await tx.bid.update({
                    where: {
                        id: bid.id,
                    },
                    data: {
                        amount: auction.currentBid,
                    },
                });
            }

            return auction;
        });
        await pub.publish(
            "bid",
            JSON.stringify({
                user: { id: session.user.id },
                auction: {
                    id: result.id,
                    amount: result.currentBid.toNumber(),
                    buyout: false,
                },
            }),
        );
        return Response.json(result, { status: 200 });
    } catch (error: unknown) {
        const [data, init] =
            error instanceof HttpError
                ? [
                      { info: error.info, message: error.message },
                      { status: error.status },
                  ]
                : [
                      {
                          info: {
                              message: "Server Error",
                          },
                          message: "unknown error",
                      },
                      { status: 500 },
                  ];
        return Response.json(data, init);
    }
}
