import { Session } from "@/types";
import { cookies, headers } from "next/headers";
import * as jose from "jose";
import config from "@/config";
import { cache } from "react";

let keyPromise: Promise<{
    privateKey: jose.KeyLike;
    publicKey: jose.KeyLike;
}> | null = null;

const loadKey = async () => {
    if (keyPromise) return await keyPromise;
    keyPromise = (async () => {
        const spki = config.session.jwePublicKey;
        const pkcs8 = config.session.jwePrivateKey;
        const privateKey = await jose.importPKCS8(pkcs8, config.session.alg);
        const publicKey = await jose.importSPKI(spki, config.session.alg);
        return { privateKey, publicKey };
    })();

    return await keyPromise;
};

export const encrypt = async (user: { id: number }, device: any = "") => {
    const { publicKey } = await loadKey();
    return new jose.CompactEncrypt(
        new TextEncoder().encode(JSON.stringify({ user, device })),
    )
        .setProtectedHeader({
            alg: config.session.alg,
            enc: config.session.enc,
        })
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

export const login = async (user: { id: number }) => {
    const heads = await headers();
    const cookieStore = await cookies();
    const encryptedString = await encrypt(user, heads.get("User-Agent"));
    cookieStore.set(config.session.cookieName, encryptedString, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        secure: process.env.NODE_ENV === "production",
    });
};

export const getSession = cache(async (): Promise<Session | null> => {
    const cookie = (await cookies()).get(config.session.cookieName)?.value;
    const session = cookie && (await decrypt(cookie));
    return session ? session : null;
});
