import prisma from "@/database/prisma";
import { HttpError } from "@/lib/exception";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import z from "zod";

const createSchema = z
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
    .refine((data) => data.startingPrice > data.buyoutPrice, {
        message: "must be greter than starting price.",
        path: ["buyoutPrice"],
    });

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;
    const formData = await request.formData();
    const validatedFields = await createSchema.spa(
        Object.fromEntries(formData.entries()),
    );
    try {
        if (!validatedFields.success) {
            throw new HttpError({
                info: validatedFields.error.flatten().fieldErrors,
                status: 422,
            });
        }

        const item = await prisma.item.findUnique({
            where: { id: Number(id) },
        });

        if (!item) {
            throw new HttpError({ status: 404 });
        }

        const auction = await prisma.auction.create({
            data: { ...validatedFields.data, itemId: item.id, increase: 5 },
        });

        return Response.json(auction, { status: 200 });
    } catch (error: unknown) {
        const [data, init] =
            error instanceof HttpError
                ? [
                      { info: error.info, message: error.message },
                      { status: error.status },
                  ]
                : [{ info: {}, message: "unknown error" }, { status: 500 }];
        return Response.json(data, init);
    }
}
