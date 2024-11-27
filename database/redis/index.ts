// redis.js
import config from "@/config";
import Redis from "ioredis";

const redisClientSingleton = () => {
    const { url, ...others } = config.redis;
    const connection =
        process.env.NODE_ENV !== "production"
            ? new Redis({ maxRetriesPerRequest: null, ...others })
            : new Redis(url, { maxRetriesPerRequest: null });
    const pub = connection.duplicate();
    return { connection, pub };
};

declare const globalThis: {
    redisGlobal: ReturnType<typeof redisClientSingleton>;
} & typeof global;

export const { connection, pub } =
    globalThis.redisGlobal ?? redisClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalThis.redisGlobal = { connection, pub };
}
