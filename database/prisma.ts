import { getAuctionStatus } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient().$extends({
        result: {
            auction: {
                status: {
                    needs: { startTime: true, endTime: true },
                    compute(auction) {
                        return getAuctionStatus(
                            auction.startTime,
                            auction.endTime,
                        );
                    },
                },
            },
        },
    });
};

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
