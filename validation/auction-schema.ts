import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/library";

export const CreateAuctionSchema = z
    .object({
        startTime: z
            .string({ required_error: "required." })
            .pipe(z.coerce.date())
            .transform((date) => new Date(date)),
        endTime: z
            .string({ required_error: "required." })
            .pipe(z.coerce.date())
            .transform((date) => new Date(date)),
        startingPrice: z
            .string({ required_error: "Invalid Input." })
            .regex(/^\d+(\.\d+)?$/, "Invalid Input.")
            .transform((price) => new Decimal(price)),
        buyoutPrice: z
            .string({ required_error: "Invalid Input." })
            .regex(/^\d+(\.\d+)?$/, "Invalid Input.")
            .transform((price) => new Decimal(price)),
        description: z.string().nullable(),
    })
    .refine((data) => data.startTime < data.endTime, {
        message: "must not be earlier than start time.",
        path: ["endTime"],
    })
    .refine((data) => data.startingPrice < data.buyoutPrice, {
        message: "must be greater than starting price.",
        path: ["buyoutPrice"],
    });

export type createAuctionSchemaType = z.infer<typeof CreateAuctionSchema>;

export const AuctionBidSchema = z.object({
    amount: z
        .number({ required_error: "Bib Amount is required" })
        .transform((amount) => new Decimal(amount)),
});
