import  { User } from "../../services/User";
import { Request, Response, Router } from "express";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
const router = Router();

export class UserController {
    public routes() {
        router.post("/create", this._createUser);
        router.post("/auth/login", this._login);
        return router;
    }

    private async _login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const data = await User.getUserByEmailOrTelephone(email);
            if(data) {
                const user = new User(data.name, data.email, data.telephone, password);

                const token = await user.login();

                return res.status(200).json({ authorization: token });
            }
        } catch (err) {
            const { message } = err as errors;
            res.status(401).json({ error: message });
        }
    }

    private async _createUser(req: Request, res: Response) {
        const { name, email, telephone, password } = req.body;
        try {
            const user = new User(name, email, telephone, password, "USER");

            await user.createUser().then(() => {
                return res.status(201).json({ message: "User successfully created." });
            });
        } catch (err) {
            const errorMessage = (err as PrismaClientValidationError).message;

            if ((err as PrismaClientKnownRequestError).code === "P2002") return res.status(409).json({ message: "This user already exists" });

            else if ((err as PrismaClientValidationError).message) return  res.status(406).json({ error: errorMessage });

            else return  res.status(500).json({ message: "Uncknow error" });

        }



    }
}
