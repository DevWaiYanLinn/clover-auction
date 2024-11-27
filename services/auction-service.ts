import prisma from "@/database/prisma";
import { AuctionStatus, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const getAllAuctions = async ({
    subcategory,
    name,
    status,
}: {
    [key: string]: string | string[] | undefined;
} = {}) => {
    const filter: {
        item: { subCategoryId?: number; name?: string };
        status?: AuctionStatus;
    } = {
        item: {},
    };

    if (subcategory && typeof subcategory === "string") {
        filter.item["subCategoryId"] = Number(subcategory);
    }

    if (name && typeof name === "string") {
        filter.item["name"] = name;
    }

    if (Object.values(AuctionStatus).some((s) => s === status)) {
        filter["status"] = status as AuctionStatus;
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    const auctions = await prisma.auction.findMany({
        include: {
            winner: {
                select: {
                    id: true,
                    name: true,
                },
            },
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
        where: { startTime: { gte: oneMonthAgo }, ...filter },
        orderBy: {
            id: "desc",
        },
    });

    return auctions.map(
        ({ startingPrice, buyoutPrice, currentBid, ...others }) => ({
            ...others,
            startingPrice: startingPrice.toNumber(),
            buyoutPrice: buyoutPrice.toNumber(),
            currentBid: currentBid.toNumber(),
        }),
    );
};

export const auctionRankById = async (id: string | number) => {
    const query: any = Prisma.sql`
   SELECT 
        b.id,
        b.bid_time as bidTime,
        b.amount,
        LAG(b.amount) OVER (ORDER BY b.bid_time) AS previousAmount,
        b.amount - LAG(b.amount) OVER (ORDER BY b.bid_time) AS difference,
        u.id AS userId,
        u.name as username
    FROM bids b
    JOIN users u ON b.user_id = u.id
    WHERE b.auction_id = ?
    ORDER BY b.amount desc
    LIMIT 10;
`;
    query.values = [id];

    const bids = await prisma.$queryRaw<Array<any>>(query);
    return bids.map(
        ({ amount, previousAmount, difference, bidTime, ...others }) => {
            return {
                amount: (amount as Decimal).toNumber(),
                previousAmount: Number(previousAmount),
                difference: Number(difference),
                bidTime: (bidTime as Date).toDateString(),
                ...others,
            };
        },
    );
};

export const getAllAuctionsByUserId = async (userId: number) => {
    const auctions = await prisma.auction.findMany({
        where: {
            item: {
                userId: userId,
            },
        },
        include: {
            item: true,
        },
    });

    return auctions.map((auction) => {
        return {
            ...auction,
            currentBid: auction.currentBid.toNumber(),
            startingPrice: auction.startingPrice.toNumber(),
            buyoutPrice: auction.buyoutPrice.toNumber(),
        };
    });
};
