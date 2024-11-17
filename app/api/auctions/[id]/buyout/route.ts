import prisma from "@/database/prisma";
import publisher from "@/database/redis/publisher";
import { HttpError } from "@/lib/exception";
import { auth } from "@/lib/session";
import { AuctionStatus } from "@prisma/client";
import { type NextRequest } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;

    const found = await prisma.auction.findUnique({
        where: {
            id: Number(id),
            userId: null,
            buyout: false,
        },
    });

    const session = await auth();

    try {
        if (!session) {
            throw new HttpError({
                status: 401,
                info: {
                    message: "Session Expired.",
                },
            });
        }

        if (!found) {
            throw new HttpError({
                status: 403,
                info: {
                    message: "Auction not found.",
                },
            });
        }

        if (found.status !== AuctionStatus.OPEN) {
            throw new HttpError({
                status: 422,
                info: {
                    message: "Auction no longer open.",
                },
            });
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

        if (Number(found.buyoutPrice) <= Number(found.currentBid)) {
            throw new HttpError({
                status: 422,
                info: {
                    message:
                        "Current bid Price greater than or equal buyout price.",
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
                    userId: session!.user.id,
                    currentBid: found.buyoutPrice,
                    buyout: true,
                },
            });

            if (!auction) {
                throw new HttpError({
                    status: 409,
                    info: {
                        message: "Someone already bid.Try Again!",
                    },
                });
            }

            await prisma.bid.create({
                data: {
                    auctionId: auction.id,
                    userId: session!.user.id,
                    amount: auction.buyoutPrice,
                },
            });
            return auction;
        });

        await publisher.publish(
            "buyout",
            JSON.stringify({
                user: { id: session.user.id },
                auction: {
                    id: result.id,
                    amount: Number(result.buyoutPrice),
                    buyout: true,
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
