import { Queue, Worker } from "bullmq";
import { transporter } from "@/lib/node-mailer";
import redis from "@/database/redis";

export const mailQueue = new Queue("mail", { connection: redis });

const worker = new Worker(
    "mail",
    async (job) => {
        await transporter.sendMail(job.data);
    },
    { connection: redis },
);

worker.on("completed", (job: any) => {
    console.log(`${job.id} has completed!`);
});

worker.on("failed", (job: any, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
});
