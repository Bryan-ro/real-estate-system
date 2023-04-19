import { User } from "../../services/User";
import { AuthMiddleware } from "../../middlewares/authMiddlewares";
import { Router, Request, Response } from "express";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
const router = Router();

export class MasterController extends AuthMiddleware {
    public routes() {
        router.post("/create/realtor", this.verifyIfUserIsAuthenticated, this.verifyIfUserIsMaster, this._createRealtorUser);
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
            const errorMessage = (err as PrismaClientValidationError).message;

            if ((err as PrismaClientKnownRequestError).code === "P2002") {
                res.status(409).json({ message: "This user already exists" });

            } else if ((err as PrismaClientValidationError).message) {
                res.status(406).json({ error: errorMessage });

            } else {
                res.status(500).json({ message: "Uncknow error" });
            }
        }
    }
}
