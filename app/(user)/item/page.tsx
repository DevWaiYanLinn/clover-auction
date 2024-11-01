import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { RefreshCcw } from "lucide-react";

export default function Page() {
    return (
        <div className="flex p-5 space-x-3">
            <div className="max-w-[400px] rounded-md shadow-md bg-white p-5">
                <h2 className="text-3xl font-bold">Create Item</h2>
                <div className="mt-3 space-y-3">
                    <div className="flex space-x-3">
                        <div className="flex-1">
                            <Label htmlFor="name">Name</Label>
                            <Input type="name" id="email" placeholder="Name" />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="picture">Picture</Label>
                            <Input id="picture" type="file" />
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <div className="flex-1">
                            <Label htmlFor="order">Category</Label>
                            <Select>
                                <SelectTrigger className="w-full">
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
                        <div className="flex-1">
                            <Label htmlFor="order">SubCategory</Label>
                            <Select>
                                <SelectTrigger className="w-full">
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
                    <div>
                        <Label htmlFor="message">Your message</Label>
                        <Textarea
                            rows={8}
                            placeholder="Type your message here."
                            id="message"
                        />
                    </div>
                    <div>
                        <Button size={"lg"}>Submit</Button>
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-white rounded-md shadow-md p-5">
                <div className="flex justify-end mb-2">
                    <Button size={"sm"}>
                        <RefreshCcw />
                        Refresh
                    </Button>
                </div>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
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
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
