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

export default async function Home() {
    return (
        <div className=" h-screen bg-white flex justify-center p-3">
            <div className="rounded-md flex flex-col h-full w-full  border p-5">
                <div className="text-center">
                    <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Clover Auction
                    </h1>
                </div>
                <div className="flex mt-3 items-end">
                    <div className="flex-1 flex space-x-5 items-end">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input type="name" id="email" placeholder="Name" />
                        </div>
                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                type="price"
                                id="price"
                                placeholder="price"
                            />
                        </div>
                        <div>
                            <Label htmlFor="order">Order</Label>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">
                                        System
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-end">
                        {/* <div className="flex-1">
                            <div className="flex justify-between mt-1">
                                <div>
                                    <Button variant="outline" size="icon">
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="ml-2">Prev</span>
                                </div>
                                <div>
                                    <span className="mr-2">Next</span>
                                    <Button variant="outline" size="icon">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div> */}
                        <div>
                            <div className="text-center">
                                <Button variant="danger" size={"sm"}>
                                    Search
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 mt-5 space-x-3">
                    <div className="min-w-[250px] border rounded-md p-2">
                        <div className="text-center p-3">
                            <Button variant={"danger"} size={"sm"}>
                                Reset
                            </Button>
                        </div>
                        <ul className="space-y-3">
                            <li className=" cursor-pointer py-2 px-3 border text-sm rounded-md hover:bg-muted/50">
                                Electronic
                            </li>
                            <li className=" cursor-pointer py-2 px-3 border text-sm rounded-md hover:bg-muted/50">
                                Electronic
                            </li>
                            <li className="cursor-pointer py-2 px-3 border text-sm rounded-md hover:bg-muted/50">
                                Electronic
                            </li>
                        </ul>
                    </div>
                    <div className="flex-1 border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        Invoice
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">
                                        Amount
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        INV001
                                    </TableCell>
                                    <TableCell>Paid</TableCell>
                                    <TableCell>Credit Card</TableCell>
                                    <TableCell className="text-right">
                                        $250.00
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        INV001
                                    </TableCell>
                                    <TableCell>Paid</TableCell>
                                    <TableCell>Credit Card</TableCell>
                                    <TableCell className="text-right">
                                        $250.00
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
