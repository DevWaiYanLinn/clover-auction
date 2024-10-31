import { Queue } from "bullmq";
import { Worker } from "bullmq";
import { nodeMailerTransporter } from "@/services/mail-services/transporter";
import IORedis from "ioredis";
const connection = new IORedis({ maxRetriesPerRequest: null });
export const mailQueue = new Queue("mail", { connection });

const worker = new Worker(
    "mail",
    async (job) => {
        await nodeMailerTransporter.sendMail(job.data);
    },
    { connection },
);

worker.on("completed", (job: any) => {
    console.log(`${job.id} has completed!`);
});

worker.on("failed", (job: any, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
});
