import { AuctionStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getAuctionStatus(start: Date, end: Date) {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const currentTime = new Date().getTime();
    if (startTime <= currentTime && endTime > currentTime) {
        return AuctionStatus.OPEN;
    }

    if (startTime >= currentTime) {
        return AuctionStatus.CLOSED;
    }

    return AuctionStatus.FINISHED;
}

export const getBidErrorMessage = (error: any): string => {
    const errorMessages: { [key: number]: string | ((info: any) => string) } = {
        422: (info) => info.bidAmount || "Validation error occurred.",
        409: "Bid conflict: Someone already bid, try again.",
        403: "Auction has not started.",
        401: "Session has expired.",
    };

    if (errorMessages[error.status]) {
        const message = errorMessages[error.status];
        return typeof message === "function" ? message(error.info) : message;
    }

    return "Unknown Error";
};

export const sleep = (time: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};
