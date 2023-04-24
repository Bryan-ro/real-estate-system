import memoryCache from "memory-cache";
import { Auth } from "../utils/AuthUtils";
import { MailSender } from "../utils/MailSender";
const auth = new Auth();
const mailSender = new MailSender();

export class ServerCache {
    public async putVerificationCode(key: string, name: string): Promise<void> {
        const optCode = auth.generateOtpCode();
        memoryCache.put(key, { code: await optCode.hashOpt },  300000);
        await mailSender.sendMail(key, name, optCode.otpCode);
    }

    public async getVerificationCode(key: string, code: string, payload: payloadProps): Promise<string> {
        const codeData = await memoryCache.get(key);
        const compareCode = await auth.compare(code, codeData.code);
        if (compareCode) return auth.generateJwtTokenToPasswordRecovery(payload);
        else throw Error("Invalid verification code.");
    }
}
