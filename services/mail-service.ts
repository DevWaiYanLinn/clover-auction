import { Mail, MailTemplateBuilder } from "@/types";
import { mailQueue } from "@/lib/queue";
import edge from "@/lib/template-engine";
import config from "@/config";

import { CONFIRM_EMAIL, EMAIL_CONFIRM_TEMPLATE, MAIL_SEND } from "@/constants";

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

    async buildTemplate<T extends MailTemplateBuilder>(data: T) {
        if (data.type === CONFIRM_EMAIL) {
            this.html = await edge.render(EMAIL_CONFIRM_TEMPLATE, data);
        }
    }

    async send(): Promise<void> {
        await mailQueue.add(MAIL_SEND, {
            from: config.mail.from,
            to: this.to,
            subject: this.subject,
            text: this.text,
            html: this.html,
        });
    }
}

export default MailService;
