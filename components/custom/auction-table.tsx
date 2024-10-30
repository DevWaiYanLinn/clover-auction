import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const dummyAuction = [
    {
        id: 1,
        item: "Vintage Bicycle",
        image: "https://example.com/images/vintage_bicycle.jpg",
        seller: "John Doe",
        startingPrice: 100,
        buyoutPrice: 250,
        currentBid: 150,
    },
    {
        id: 2,
        item: "Antique Desk",
        image: "https://example.com/images/antique_desk.jpg",
        seller: "Jane Smith",
        startingPrice: 200,
        buyoutPrice: 400,
        currentBid: 300,
    },
    {
        id: 3,
        item: "Classic Vinyl Records",
        image: "https://example.com/images/vinyl_records.jpg",
        seller: "Alice Johnson",
        startingPrice: 50,
        buyoutPrice: 120,
        currentBid: 75,
    },
    {
        id: 4,
        item: "Handmade Quilt",
        image: "https://example.com/images/handmade_quilt.jpg",
        seller: "Bob Brown",
        startingPrice: 80,
        buyoutPrice: 200,
        currentBid: 100,
    },
    {
        id: 5,
        item: "Retro Game Console",
        image: "https://example.com/images/retro_console.jpg",
        seller: "Charlie White",
        startingPrice: 150,
        buyoutPrice: 300,
        currentBid: 175,
    },
];

const AuctionTable = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="min-w-[100px]">Item</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Starting Price</TableHead>
                    <TableHead>Buyout Price</TableHead>
                    <TableHead className="text-right">Current Bid</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {dummyAuction.map((d) => {
                    return (
                        <TableRow key={d.id}>
                            <TableCell className="font-medium">
                                {d.item}
                            </TableCell>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{d.seller}</TableCell>
                            <TableCell>{d.startingPrice}</TableCell>
                            <TableCell>{d.buyoutPrice}</TableCell>
                            <TableCell className="text-right">
                                $250.00
                            </TableCell>
                        </TableRow>
                    );
                })}
                {/* <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                </TableRow> */}
            </TableBody>
        </Table>
    );
};

export default AuctionTable;
