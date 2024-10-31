import nodemailer from "nodemailer";

export const nodeMailerTransporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_EMAIL_PASSWORD,
    },
});
