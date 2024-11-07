import type { Auction, Category, Item, SubCategory } from "@prisma/client";

export interface CategoryOnSubCategories extends Category {
    subcategories: SubCategory[];
}

export type User = {
    id: number;
    name: string;
    email: string;
    balance: any;
    reputation: number;
};

export type Session = {
    user: User;
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
}

export type ExcludeAllExcept<T, K extends keyof T> = Pick<T, K>;

export type AuctionTableType = Auction & {
    item: Item & { seller: Pick<User, "name" | "id"> };
};
