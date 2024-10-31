import { User } from "@/types";
import crypto from "crypto";
import { cookies } from "next/headers";

const key = crypto
    .createHash("sha512")
    .update(process.env.SESSION_SECRET!)
    .digest("hex")
    .substring(0, 32);
const encryptionIV = crypto
    .createHash("sha512")
    .update(process.env.SESSION_SECRET_IV!)
    .digest("hex")
    .substring(0, 16);

export const encrypt = (data: User) => {
    const cipher = crypto.createCipheriv(
        process.env.ENCRYPTION_METHOD!,
        key,
        encryptionIV,
    );
    return Buffer.from(
        cipher.update(JSON.stringify({ user: data }), "utf8", "hex") +
            cipher.final("hex"),
    ).toString("base64");
};

export const decrypt = (data: string) => {
    const buff = Buffer.from(data, "base64");
    const decipher = crypto.createDecipheriv(
        process.env.ENCRYPTION_METHOD!,
        key,
        encryptionIV,
    );
    const encryptedString =
        decipher.update(buff.toString("utf8"), "hex", "utf8") +
        decipher.final("utf8");
    return JSON.parse(encryptedString);
};

export const getServerSession = async () => {
    try {
        const cookie = (await cookies()).get(
            process.env.SESSION_COOKIE_NAME!,
        )!.value;
        return decrypt(cookie);
    } catch {
        return null;
    }
};
