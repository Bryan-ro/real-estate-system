import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { User } from "../services/User";
import { Auth } from "../utils/AuthUtils";
const auth = new Auth();

export abstract class AuthMiddleware {
    protected verifyIfUserIsAuthenticated(req: Request, res: Response, next: NextFunction) {
        const { authorization } = req.headers;

        try {
            if (authorization) {
                const validation = auth.verifyJwtTokenToLogin(authorization) as payloadProps;
                if(validation) {
                    req.user = {
                        id: validation.id,
                        email: validation.email,
                        name: validation.name,
                        telephone: validation.telephone
                    };

                    return next();
                }
            } else throw Error("Token not provided.");

        } catch (err) {
            const { message } = err as errors;

            if((err as JsonWebTokenError).name === "JsonWebTokenError") return res.status(401).json({ Error: "Invalid session token." });
            if ((err as TokenExpiredError).name === "TokenExpiredError") return res.status(401).json({ Error: "Token Expired" });
            else return res.status(401).json({ error: message });

        }
    }

    protected async verifyIfUserIsMaster(req: Request, res: Response, next: NextFunction) {
        const { id, email } = req.user;

        try {
            const user = await User.getUserByEmailOrTelephone(email);

            if(user?.id !== id) throw new Error("The user does not match.");
            if(user.role !== "MASTER") throw new Error("Not authorized.");
            if(user.role === "MASTER") return next();


        } catch (err) {
            const { message } = err as errors;

            return res.status(401).json({ Error: message });
        }
    }

    protected verifyTokenToChangePassword(req: Request, res: Response, next: NextFunction) {
        const { authorization } = req.headers;

        try {
            if (authorization) {
                const validation = auth.verifyJwtTokenToPasswordRecovery(authorization) as payloadProps;
                if(validation) {
                    req.user = {
                        id: validation.id,
                        email: validation.email,
                        name: validation.name,
                        telephone: validation.telephone
                    };
                    return next();
                }
            } else throw Error("Token not provided.");
        } catch (err) {
            const { message } = err as errors;

            if((err as JsonWebTokenError).name === "JsonWebTokenError") return res.status(400).json({ Error: "Invalid session token." });
            if ((err as TokenExpiredError).name === "TokenExpiredError") return res.status(401).json({ Error: "Token Expired" });
            else return res.status(401).json({ error: message });
        }
    }
}
