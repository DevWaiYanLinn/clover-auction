// redis.js
import config from "@/config";
import Redis from "ioredis";

const publisherSingleton = () => {
    return process.env.NODE_ENV !== "production"
        ? new Redis({ maxRetriesPerRequest: null })
        : new Redis(config.redis.url, { maxRetriesPerRequest: null });
};

declare const globalThis: {
    publisherGlobal: ReturnType<typeof publisherSingleton>;
} & typeof global;

const publisher = globalThis.publisherGlobal ?? publisherSingleton();

export default publisher;

if (process.env.NODE_ENV !== "production") {
    globalThis.publisherGlobal = publisher;
}
