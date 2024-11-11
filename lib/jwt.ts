import * as jose from "jose";

interface JwtPayload {
    [key: string]: any;
}

export const signJwt = async <T extends JwtPayload>({ payload }: T) => {
    const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({
            alg: process.env.JWT_ALG!,
        })
        .setExpirationTime("1h")
        .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    return jwt;
};

export const jwtVerify = async (jwt: string) => {
    const { payload } = await jose.jwtVerify(
        jwt,
        new TextEncoder().encode(process.env.JWT_SECRET!),
        {
            issuer: "urn:example:issuer",
            audience: "urn:example:audience",
        },
    );

    return payload;
};
