import { ConfirmMail, Mail } from "@/types";
import { mailQueue } from "@/lib/queue";
import edge from "@/lib/template-engine";

class Mailer {
    protected to: string;
    protected subject: string;
    protected text: string;
    protected html: string;

    constructor({ to, subject, text = "", html = "" }: Mail) {
        this.to = to;
        this.subject = subject;
        this.text = text;
        this.html = html;
    }

    async buildTemplate(data: ConfirmMail) {
        if (data.type === "CONFIRM_EMAIL") {
            this.html = await edge.render("mail-template/email-confirm", data);
        }
    }

    async send() {
        return mailQueue.add("MAIL_SEND", {
            from: process.env.MAILER_EMAIL_FROM,
            to: this.to,
            subject: this.subject,
            text: this.text,
            html: this.html,
        });
    }
}

export default Mailer;
