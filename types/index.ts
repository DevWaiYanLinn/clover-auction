import type {
    Auction,
    Category,
    Item,
    SubCategory,
    User as PrismaUser,
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

export type AuctionTableData = Auction & {
    item: Item & { seller: Pick<User, "name" | "id"> };
};

export interface CategoryWithSubCategories extends Category {
    subcategories: SubCategory[];
}

export type ParamsPromise = Promise<{ [key: string]: string }>;

export type searchParamsPromise = Promise<{ [key: string]: string }>;

export type BidRecord = {
    id: number;
    bidTime: Date;
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
