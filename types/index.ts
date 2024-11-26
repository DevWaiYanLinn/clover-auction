import type {
    Auction,
    Category,
    Item,
    SubCategory,
    User as PrismaUser,
    Bid,
} from "@prisma/client";

export type User = {
    id: number;
    name: string;
    email: string;
    balance: any;
    reputation: number;
};

export type Session = {
    user: { id: number };
    device?: string;
};

export type Mail = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
};

export interface MailTemplateBuilder {
    type: string;
}

export interface ConfirmMail extends MailTemplateBuilder {
    email: string;
    token: string;
    url: string;
}

export type AuctionJson = Omit<
    Auction,
    "startingPrice" | "buyoutPrice" | "currentBid" | "startTime" | "endTime"
> & {
    startingPrice: number;
    buyoutPrice: number;
    currentBid: number;
    startTime: string;
    endTime: string;
} & {
    winner: Pick<User, "name" | "id"> | null;
} & {
    item: Item & {
        seller: Pick<User, "name" | "id">;
    };
};

export interface CategoryWithSubCategories extends Category {
    subcategories: SubCategory[];
}

export type ParamsPromise = Promise<{ [key: string]: string }>;

export type searchParamsPromise = Promise<{ [key: string]: string }>;

export type BidRecord = {
    id: number;
    bidTime: string;
    amount: number;
    previousAmount: number;
    difference: number;
    userId: number;
    username: string;
};

export type AuthUser = Omit<
    PrismaUser,
    "password" | "createdAt" | "updatedAt" | "balance"
>;

export type findOrCreateUserType = {
    email: string;
    data: { name: string; email: string; password: string };
};

export type SocketBid = {
    user: { id: number };
    auction: { id: number; amount: number };
};

export type FetchError = {
    info: { [key: string]: string | string[] };
    status: number;
    message: string;
};

export type UserBidJson = Omit<Bid, "amount"> & {
    amount: number;
    auction: {
        id: number;
        userId: number | null;
        endTime: string;
        item: Item;
    };
};

export type UserAuctionJson = Omit<
    Auction,
    "startingPrice" | "buyoutPrice" | "currentBid"
> & {
    startingPrice: number;
    buyoutPrice: number;
    currentBid: number;
    item: Item;
};
