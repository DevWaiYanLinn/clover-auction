import config from "@/config";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: config.mail.auth,
});
