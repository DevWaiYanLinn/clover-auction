import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants";

export const CreateItemSchema = z.object({
    name: z
        .string({
            required_error: "Invalid input.",
        })
        .min(1, "required."),
    subcategory: z
        .string({ required_error: "Invalid Input." })
        .regex(/^\d+$/, "Invalid Input.")
        .transform((d) => Number(d)),
    description: z
        .string({ required_error: "Invalid Input." })
        .min(1, "required."),
    photo: z
        .any()
        .refine((file: File) => file?.name !== "undefined", "File is required.")
        .refine(
            (file: File) => file?.size <= MAX_FILE_SIZE,
            "File size must be less than or equal 1MB.",
        )
        .refine(
            (file: File) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png, .webp.",
        ),
});

export type CreateItemSchemaType = z.infer<typeof CreateItemSchema>;
