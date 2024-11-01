import { User } from "@/types";
import { cookies } from "next/headers";
import * as jose from "jose";

let key: { privateKey: jose.KeyLike; publicKey: jose.KeyLike };

const loadKey = async () => {
    const y = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsRrw5m/cSI8B4jvf0XuC
8LV7qh5gYIGrkAXD70VIgLfYuCnYcYtYVpzySTyyNzkVeFNslSl007ydONvov/pb
XLEhYhhKI1qVDTlgMud8sT+bkvCl0JPb1cW/6Wja16GPI6NHlPo6u/OoWucU2llz
Lly9bUQr4V1dKKD5xM6A+Ygsi0wc6rtmFg3EFfTe6c/AH+r4lJcR/C1cHS9ANa1+
TJf+dpxUTzDgLf+3g1vCR+H/G8eFES4HKo3JESk5JHepxVssG6jA9De6DMORI7Hn
mLGTbDUHWyuCDbX2QXcUOxoFMOHXGcQ5+0kMe5RbjZDelpW1sP3bA5qEAAvc5w+1
mwIDAQAB
-----END PUBLIC KEY-----
`;

    const x = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxGvDmb9xIjwHi
O9/Re4LwtXuqHmBggauQBcPvRUiAt9i4Kdhxi1hWnPJJPLI3ORV4U2yVKXTTvJ04
2+i/+ltcsSFiGEojWpUNOWAy53yxP5uS8KXQk9vVxb/paNrXoY8jo0eU+jq786ha
5xTaWXMuXL1tRCvhXV0ooPnEzoD5iCyLTBzqu2YWDcQV9N7pz8Af6viUlxH8LVwd
L0A1rX5Ml/52nFRPMOAt/7eDW8JH4f8bx4URLgcqjckRKTkkd6nFWywbqMD0N7oM
w5EjseeYsZNsNQdbK4INtfZBdxQ7GgUw4dcZxDn7SQx7lFuNkN6WlbWw/dsDmoQA
C9znD7WbAgMBAAECggEBAJycR0RuzGu5UiAddClJQBvdUBK6M92DLRP5lS7jpF52
tIT+M/EMGLzWooXSz4F30B2MH+uzMiT+mEUsaaBCIkJQPEYDVqP2uPFtuDyraR9Q
MSF5/hb4eSCLcs5TM5oUun/4Jhd+QyvrJgfkahM/oFPyHGwgKXFrXzLLTrMTLQf6
Qy/8cbtp1RtQ6bzBNJxIQIX/UR4Gyo4q40ilOCc3gHipn9Dd055HN7j2QxGFnAop
Q8bCGTzjGJZU/HP1VWSsyFmNO8zivQ+HoI/7smQO6SJ6kjYU1iuHSaM7lGVRImh9
n5u59UtgQDh7WDjntTOAY7sqMEKcdRdLxOTw3E0g0MkCgYEAzpUqzNRcEQSN6NwD
/4gY885l+jXjBsYKX/LXx/g7iC/HzVNY/XFOHj887s5iMoD0hePkmJlqjBve1RzI
QRzH7HNNteh4QQghgBAg1LT9mzY+vJERISHy/OwBSeeWUpks0CTmH6CQRL1OXk0M
O1JMSzwwl23WKTcDhWLp+rnk3ocCgYEA23id1LuekI+VnJbmfXow+qWQrVTrUfpb
21DB4XN5vwSyya0hfcQCcF6XVahMZMrpJ1HzEJa4FO9E2T41ECPXj+HHLyaBOjgk
YR4fZad73ri4nzP8lEQyKIYIO+F9LB6O5nk0aL7czhQwOYSRuE/Yho/2/uL48T86
559mSRMjwU0CgYBNSAZj7AmpICAKfcxNGtfi1VLXALO2g/27mThaCaYTs3Q2friq
z2le7V9ZIwIfTJitQezxnWr7kS2SYhsUKLUt4pCuvZHHGkiWBPKTQEYje26K0mYr
E+036v4sbKOSsNTP5Q3lxQZTgNJBeudZhdceyhyPebqFXpxFmRRZBJP3HwKBgEem
tUCCkF35woqA6XcFsX/jFbzBAKKe7eZIE0Qbgx/N1ODq2QhKOdGd0CJy853kcQIZ
SxWbXzXWd8/E82X1jaa3u2O1WnM7aQUb5Hw3lcU84Wl4e3mcWhPIzl9eWpNQ1q5/
25Bm34eYJ7ZfhYN67eHglm7YgxWf4wdDjw1EZmPxAoGAcFxpwfIZx/CVmgrSM624
yXYDcQohGPD7fNTFtQKjp+23RYvjH6OzQR8Q8nddzVEOlWjxa8s0ihImdMimM1hv
hNUY+6/iCMutx+c4bnik3PsGPBY9G80N3qG/PDldlj0oO3PkuM06HwDRLUU33NXa
pMbKRU9NceNz4qRl9W3zWFo=
-----END PRIVATE KEY-----

`;

    const privateKey = await jose.importPKCS8(x, "RSA-OAEP-256");
    const publicKey = await jose.importSPKI(y, "RSA-OAEP-256");

    key = { privateKey, publicKey };
    return key;
};

export const encrypt = async (user: User) => {
    const { publicKey } = key || (await loadKey());
    return new jose.CompactEncrypt(
        new TextEncoder().encode(JSON.stringify({ user })),
    )
        .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
        .encrypt(publicKey);
};

export const decrypt = async (jwe: string) => {
    const { privateKey } = key || (await loadKey());
    const { plaintext } = await jose.compactDecrypt(jwe, privateKey);
    return JSON.parse(new TextDecoder().decode(plaintext));
};

export const getServerSession = async () => {
    try {
        const cookie = (await cookies()).get(
            process.env.SESSION_COOKIE_NAME!,
        )?.value;
        return !cookie ? null : decrypt(cookie);
    } catch {
        return null;
    }
};
