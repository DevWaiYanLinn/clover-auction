import { Mail, MailBuilder } from "@/types";
import { mailQueue } from "@/lib/queue";
import edge from "@/lib/template-engine";
import config from "@/config";

class MailService {
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

    async buildTemplate<T extends MailBuilder>(data: T) {
        if (data.type === "CONFIRM_EMAIL") {
            this.html = await edge.render("mail-template/email-confirm", data);
        }
    }

    async send() {
        return mailQueue.add("MAIL_SEND", {
            from: config.mail.from,
            to: this.to,
            subject: this.subject,
            text: this.text,
            html: this.html,
        });
    }
}

export default MailService;
