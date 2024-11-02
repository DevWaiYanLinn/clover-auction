// redis.js
import Redis from "ioredis";

const redisClientSingleton = () => {
    return new Redis();
};

declare const globalThis: {
    redisGlobal: ReturnType<typeof redisClientSingleton>;
} & typeof global;

const redis = globalThis.redisGlobal ?? redisClientSingleton();

export default redis;

if (process.env.NODE_ENV !== "production") {
    globalThis.redisGlobal = redis;
}
