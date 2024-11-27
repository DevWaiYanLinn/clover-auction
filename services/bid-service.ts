import prisma from "@/database/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { HttpError } from "@/lib/exception";
import { AuctionStatus } from "@prisma/client";
import { auth } from "@/lib/session";
import { pub } from "@/database/redis";

export const getAllBidsByUserId = async (id: number) => {
    const bids = await prisma.bid.findMany({
        where: {
            userId: id,
        },
        include: {
            auction: {
                include: {
                    item: true,
                },
            },
        },
    });

    return bids.map((b) => {
        return { ...b, amount: b.amount.toNumber() };
    });
};

export const bidByAuctionId = async (id: number, amount: Decimal) => {
    const found = await prisma.auction.findUnique({
        where: {
            id: Number(id),
        },
    });

    if (!found) {
        throw new HttpError({ status: 404, message: "Auction not found." });
    }

    if (found.status !== AuctionStatus.OPEN) {
        throw new HttpError({
            status: 403,
            info: {
                message: "Auction is no longer opening.",
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

    const currentBid =
        found.currentBid.toNumber() || found.startingPrice.toNumber();

    if (amount.toNumber() < currentBid + (found.increase / 100) * currentBid) {
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
    const buyout = amount.toNumber() >= found.buyoutPrice.toNumber();

    const result = await prisma.$transaction(async (tx) => {
        const auction = await tx.auction.update({
            where: {
                id: found.id,
                updatedAt: found.updatedAt,
            },
            data: {
                currentBid: amount,
                buyout,
                userId: session.user.id,
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
        buyout ? "buyout" : "bid",
        JSON.stringify({
            user: { id: session.user.id },
            auction: {
                id: result.id,
                amount: result.currentBid.toNumber(),
            },
        }),
    );

    return result;
};

export const buyoutByAuctionId = async (id: number) => {
    const session = await auth();
    if (!session) {
        throw new HttpError({
            status: 401,
            info: {
                message: "Session Expired.",
            },
        });
    }

    const found = await prisma.auction.findUnique({
        where: {
            id: Number(id),
        },
    });

    if (!found) {
        throw new HttpError({
            status: 403,
            info: {
                message: "Auction not found.",
            },
        });
    }

    if (found.userId === session.user.id) {
        throw new HttpError({
            status: 403,
            info: { message: "You can't buyout your own auction." },
        });
    }

    if (found.status !== AuctionStatus.OPEN) {
        throw new HttpError({
            status: 403,
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
    const result = await prisma.$transaction(async (tx) => {
        const auction = await tx.auction.update({
            where: {
                id: found.id,
                updatedAt: found.updatedAt,
            },
            data: {
                userId: session.user.id,
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

        const bid = await prisma.bid.findFirst({
            where: {
                auctionId: auction.id,
                userId: session.user.id,
            },
        });

        if (!bid) {
            await tx.bid.create({
                data: {
                    auctionId: auction.id,
                    userId: session.user.id,
                    amount: auction.buyoutPrice,
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
        "buyout",
        JSON.stringify({
            user: { id: session.user.id },
            auction: {
                id: result.id,
                amount: result.buyoutPrice.toNumber(),
            },
        }),
    );

    return result;
};
