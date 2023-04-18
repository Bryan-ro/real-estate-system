import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export class Auth {
    private async _hashPassword(password: string): Promise<string> {
        return await hash(password, 15);
    }

    private async _comparePassword(password: string, hash: string): Promise<boolean> {
        return await compare(password, hash);
    }

    private _generateJwtToken(payload: payloadProps): string {
        return sign(payload, process.env.JWT_TOKEN ?? "");
    }

    public async hashPassword(password: string): Promise<string>  {
        return await this._hashPassword(password);
    }

    public async compare(password: string, hash: string): Promise<boolean> {
        return await this._comparePassword(password, hash);
    }

    public  generateJwtToken (payload: payloadProps): string {
        return this._generateJwtToken(payload);
    }
}
