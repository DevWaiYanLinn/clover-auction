import type { Category, SubCategory } from "@prisma/client";

export interface CategoryOnSubCategories extends Category {
    subcategories: SubCategory[];
}

export type User = {
    name: string;
    email: string;
    balance: any;
    reputation: number;
};

export type Session = {
    user: User;
};

export type Mail = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
};

export interface MailBuilder {
    type: string;
}

export interface ConfirmMail extends MailBuilder {
    email: string;
    token: string;
}
