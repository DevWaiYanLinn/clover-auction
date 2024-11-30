import { AuctionStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getAuctionStatus(start: Date | string, end: Date | string) {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const currentTime = new Date().getTime();

    if (startTime <= currentTime && endTime > currentTime) {
        return AuctionStatus.Open;
    }

    if (startTime >= currentTime) {
        return AuctionStatus.Close;
    }

    return AuctionStatus.Finshed;
}

export const sleep = (time: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};
