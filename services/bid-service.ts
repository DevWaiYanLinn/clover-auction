import prisma from "@/database/prisma";

export const getAllBidsByUser = async (id: number) => {
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
