"use server";
import prisma from "@/database/prisma";

export const getAllAuctions = async () => {
    return prisma.auction.findMany({
        // where:{
        //     item:{
        //         categoryId:1
        //     }
        // },
        include: {
            item: true,
        },
    });
};
