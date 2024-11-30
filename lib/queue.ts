import { Queue, Worker } from "bullmq";
import { transporter } from "@/lib/node-mailer";
import { connection } from "@/database/redis";

export const mailQueue = new Queue("mail", {
    connection,
    defaultJobOptions: {
        attempts: 2,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
    },
});

const worker = new Worker(
    "mail",
    async (job) => {
        await transporter.sendMail(job.data);
    },
    {
        connection,
        removeOnFail: { count: 0 },
        removeOnComplete: { count: 0 },
        concurrency: 10,
    },
);

worker.on("completed", (job: any) => {
    console.log(`${job.id} has completed!`);
});

worker.on("failed", (job: any, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
});
