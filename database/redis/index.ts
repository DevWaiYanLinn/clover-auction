// redis.js
import config from "@/config";
import Redis from "ioredis";

const redisClientSingleton = () => {
    return process.env.NODE_ENV !== "production"
        ? new Redis({ maxRetriesPerRequest: null })
        : new Redis(config.redis.url, { maxRetriesPerRequest: null });
};

declare const globalThis: {
    redisGlobal: ReturnType<typeof redisClientSingleton>;
} & typeof global;

const redis = globalThis.redisGlobal ?? redisClientSingleton();

export default redis;

if (process.env.NODE_ENV !== "production") {
    globalThis.redisGlobal = redis;
}
