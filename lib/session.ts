import { Session, User } from "@/types";
import { cookies } from "next/headers";
import * as jose from "jose";
import config from "@/config";
import prisma from "../database/prisma";

let keyPromise: Promise<{
    privateKey: jose.KeyLike;
    publicKey: jose.KeyLike;
}> | null = null;

const loadKey = async () => {
    if (keyPromise) return await keyPromise;
    keyPromise = (async () => {
        const spki = config.session.jwePublicKey;
        const pkcs8 = config.session.jwePrivateKey;
        const privateKey = await jose.importPKCS8(pkcs8, "RSA-OAEP-256");
        const publicKey = await jose.importSPKI(spki, "RSA-OAEP-256");
        return { privateKey, publicKey };
    })();

    return await keyPromise;
};

export const encrypt = async (user: User) => {
    const { publicKey } = await loadKey();
    return new jose.CompactEncrypt(
        new TextEncoder().encode(JSON.stringify({ user })),
    )
        .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
        .encrypt(publicKey);
};

export const decrypt = async (jwe: string): Promise<Session | null> => {
    try {
        const { privateKey } = await loadKey();
        const { plaintext } = await jose.compactDecrypt(jwe, privateKey);
        return JSON.parse(new TextDecoder().decode(plaintext));
    } catch {
        return null;
    }
};

export const getServerSession = async (): Promise<Session | null> => {
    const cookie = (await cookies()).get(config.session.cookieName)?.value;

    const session = cookie && (await decrypt(cookie));

    const user =
        session &&
        (await prisma.user.findUnique({
            where: { email: session.user.email },
        }));

    if (user) {
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                balance: Number(user.balance),
                reputation: user.reputation,
            },
        };
    }
    return null;
};
