import prisma from "@/database/prisma";
import { ParamsPromise } from "@/types";
import Image from "next/legacy/image";

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

    return (
        <div className="max-w-[300px] w-full flex flex-col border rounded-md px-2">
            {auction ? (
                <div className="p-5 space-y-3 overflow-hidden overflow-y-auto">
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
                            <p className="mt-3 text-sm">
                                {auction.description}
                            </p>
                        </li>
                    </ul>
                </div>
            ) : (
                <div className="flex h-full justify-center items-center">
                    Not Found
                </div>
            )}
        </div>
    );
}
