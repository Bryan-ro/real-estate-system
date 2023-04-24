import  { User } from "../../services/User";
import { ServerCache } from "../../services/ServerCacheMethods";
import { Request, Response, Router } from "express";
const serverCache = new ServerCache();
const router = Router();


export class AllUserController {
    public routes() {
        router.post("/auth/login", this._login);
        router.post("/auth/request-password", this._requestPasswordChange);
        router.post("/auth/change-password", this._validateVerificationCode);
        return router;
    }

    private async _login(req: Request, res: Response) {
        const { login, password } = req.body;
        try {
            const data = await User.getUserByEmailOrTelephone(login);
            if(data) {
                const user = new User(data.name, data.email, data.telephone, password);

                const token = await user.login();

                return res.status(200).json({ authorization: token });
            } else throw new Error("Invalid credentials. Please check your login and password.");
        } catch (err) {
            const { message } = err as errors;
            res.status(401).json({ error: message });
        }
    }

    private async _requestPasswordChange (req: Request, res: Response) {
        const { credentials } = req.body; // Email or telephone

        try {
            const user = await User.getUserByEmailOrTelephone(credentials);
            if(user) {
                await serverCache.putVerificationCode(user.email, user.name);
                return res.status(200).json({ message: "The verification code has been sent to the email" });
            } else throw new Error("User does not exist");

        } catch (err) {
            let status = 500;
            if((err as errors).message === "User does not exist") status = 404;

            return res.status(status).json({ error: (err as errors).message });

        }
    }

    private async _validateVerificationCode(req: Request, res: Response) {
        const { email, code } = req.body;

        try {
            const userData = await User.getUserByEmailOrTelephone(email);
            if (!userData) throw new Error("Invalid email");

            const validation = await serverCache.getVerificationCode(email, code, {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                telephone: userData.telephone
            });

            res.status(200).json({ authorization: validation });

        } catch (err) {
            res.status(401).json({ error: (err as errors).message });
        }
    }

    private async _changePassword(req: Request, res: Response) {
        return "";
    }
}
