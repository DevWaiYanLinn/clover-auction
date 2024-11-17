import prisma from "@/database/prisma";
import { ParamsPromise } from "@/types";
import Image from "next/legacy/image";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: ParamsPromise }) {
    const id = await (await params).id;
    const auction = await prisma.auction.findUnique({
        where: { id: Number(id) },
        include: {
            item: {
                select: {
                    name: true,
                    imageUrl: true,
                },
            },
        },
    });
    if (!auction) {
        return notFound();
    }
    return (
        <div className="justify-center p-5 space-y-3 overflow-hidden overflow-y-auto">
            <div className="flex justify-center">
                <div className="border p-3 rounded-md">
                    <Image
                        src={auction.item.imageUrl}
                        width={150}
                        height={150}
                        alt={auction.item.name}
                    />
                    <p className="text-center text-lg font-bold text-slate-500">
                        {auction.item.name}
                    </p>
                </div>
            </div>
            <ul className="space-y-3">
                <li>
                    <h3 className="border-slate-300 text-slate-500 text-xl font-bold border-b pb-2">
                        Description
                    </h3>
                    <p className="mt-3 text-sm">{auction.description}</p>
                </li>
            </ul>
        </div>
    );
}