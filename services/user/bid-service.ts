import prisma from "@/database/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { HttpError } from "@/lib/exception";
import { AuctionStatus } from "@prisma/client";
import { pub } from "@/database/redis";
import { authenticatedUser } from "@/services/user/auth-service";
import { findAuctionById } from "@/services/user/auction-service";

export const getAllBidsByUser = async () => {
    const user = await authenticatedUser();
    const bids = await prisma.bid.findMany({
        where: {
            userId: user.id,
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
    const user = await authenticatedUser();
    const found = await findAuctionById(id);

    if (found.userId === user.id) {
        throw new HttpError({
            status: 403,
            info: { message: "You can't bid your own auction." },
        });
    }

    if (found.status !== AuctionStatus.Open) {
        throw new HttpError({
            status: 403,
            info: {
                message: "Auction is no longer opening.",
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

    const buyout = amount.toNumber() >= found.buyoutPrice.toNumber();

    const result = await prisma.$transaction(async (tx) => {
        const auction = await tx.auction.update({
            where: {
                id: found.id,
                updatedAt: found.updatedAt,
            },
            data: {
                currentBid: amount,
                userId: user.id,
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
                userId: user.id,
            },
        });

        if (!bid) {
            await tx.bid.create({
                data: {
                    userId: user.id,
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
            user: { id: user.id },
            auction: {
                id: result.id,
                amount: result.currentBid.toNumber(),
            },
        }),
    );

    return result;
};

export const buyoutByAuctionId = async (id: number) => {
    const user = await authenticatedUser();
    const found = await findAuctionById(id);

    if (found.userId === user.id) {
        throw new HttpError({
            status: 403,
            info: { message: "You can't buyout your own auction." },
        });
    }

    if (found.status !== AuctionStatus.Open) {
        throw new HttpError({
            status: 403,
            info: {
                message: "Auction is no longer open.",
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
                userId: user.id,
                currentBid: found.buyoutPrice,
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
                userId: user.id,
            },
        });

        if (!bid) {
            await tx.bid.create({
                data: {
                    auctionId: auction.id,
                    userId: user.id,
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
            user: { id: user.id },
            auction: {
                id: result.id,
                amount: result.buyoutPrice.toNumber(),
            },
        }),
    );

    return result;
};
