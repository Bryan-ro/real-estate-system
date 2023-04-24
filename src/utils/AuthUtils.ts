import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export class Auth {
    public async hashPassword(password: string): Promise<string> {
        return await hash(password, 15);
    }

    public async compare(password: string, hash: string): Promise<boolean> {
        return await compare(password, hash);
    }

    public generateJwtTokenToLogin(payload: payloadProps): string {
        return sign(payload, process.env.JWT_TOKEN_LOGIN ?? "", { expiresIn: "6h", algorithm: "HS512" });
    }

    public verifyJwtTokenToLogin(token: string) {
        return verify(token, process.env.JWT_TOKEN_LOGIN ?? "");
    }

    public generateJwtTokenToPasswordRecovery(payload: payloadProps): string {
        return sign(payload, process.env.JWT_TOKEN_PASSWORD_RECOVER ?? "", { expiresIn: "5m", algorithm: "HS512" });
    }

    public verifyJwtTokenToPasswordRecovery(token: string) {
        return verify(token, process.env.JWT_TOKEN_PASSWORD_RECOVER ?? "");
    }

    public generateOtpCode() {
        const otpCode = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();
        const hashOpt = this.hashPassword(otpCode);
        return {
            otpCode,
            hashOpt
        };
    }
}

