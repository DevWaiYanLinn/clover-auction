// redis.js
import config from "@/config";
import Redis from "ioredis";

const redisClientSingleton = () => {
    return new Redis(config.redis.url, { maxRetriesPerRequest: null });
};

declare const globalThis: {
    redisGlobal: ReturnType<typeof redisClientSingleton>;
} & typeof global;

const redis = globalThis.redisGlobal ?? redisClientSingleton();

(async () => {
    await redis.set("foo", "baaaaaaar");
})();

export default redis;

if (process.env.NODE_ENV !== "production") {
    globalThis.redisGlobal = redis;
}
