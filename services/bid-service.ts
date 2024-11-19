import prisma from "@/database/prisma";

export const getAllBidByUser = async (id: number) => {
    const bids = await prisma.bid.findMany({
        where: {
            userId: id,
        },
        include: {
            auction: {
                select: {
                    id: true,
                    userId: true,
                    endTime: true,
                    item: {
                        select: {
                            id: true,
                            imageUrl: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    return bids.map((b) => {
        return { ...b, amount: b.amount.toNumber() };
    });
};
