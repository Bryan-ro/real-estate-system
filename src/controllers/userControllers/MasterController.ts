import { User } from "../../services/User";
import { Router, Request, Response } from "express";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
const router = Router();

export class MasterController {
    public routes() {
        router.post("/create/realtor", this._createRealtorUser);
        return router;
    }

    private async _createRealtorUser(req: Request, res: Response) {
        try {
            const { name, email, telephone, password } = req.body;
            const user = new User(name, email, telephone, password, "REALTOR");

            await user.createUser().then(() => {
                return res.status(201).json({ message: "Realtor user, successfully created." });
            });


        } catch (err) {
            if ((err as PrismaClientKnownRequestError).code === "P2002") {
                res.status(409).json({ message: "This user already exists" });

            } else if ((err as PrismaClientValidationError).message) {
                res.status(406).json({ message: "Missing field or invalid field" });

            } else {
                res.status(500).json({ message: "Uncknow error" });
            }
            console.error(err);
        }
    }
}
