import AuctionItemCreate from "@/components/custom/auction-item-create";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;

    return (
        <div className="flex-1 flex justify-center items-center">
            <AuctionItemCreate />
        </div>
    );
}
