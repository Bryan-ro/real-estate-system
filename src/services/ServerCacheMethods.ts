import memoryCache from "memory-cache";
import { Auth } from "../utils/AuthUtils";
import { MailSender } from "../utils/MailSender";
const auth = new Auth();
const mailSender = new MailSender();

export class ServerCache {
    public async putVerificationCode(key: string, name: string): Promise<void> {
        const optCode = auth.generateOtpCode();
        memoryCache.put(key, { code: optCode.hashOpt },  300000);
        mailSender.sendMail(key, name, optCode.otpCode);
    }
}
