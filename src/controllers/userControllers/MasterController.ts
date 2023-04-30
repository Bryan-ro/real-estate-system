import { User } from "../../services/User";
import { AuthMiddleware } from "../../middlewares/authMiddlewares";
import { Router, Request, Response } from "express";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
const router = Router();

export class MasterController extends AuthMiddleware {
    public routes(): Router {
        router.get("/get-all/realtor", this.verifyIfUserIsAuthenticated, this.verifyIfUserIsMaster, this._viewAllRealtorUsers);
        router.get("/get-all/user", this.verifyIfUserIsAuthenticated, this.verifyIfUserIsMaster, this._viewAllUsers);
        router.get("/profile", this.verifyIfUserIsAuthenticated, this.verifyIfUserIsMaster, this._getUniqueUser);
        router.post("/create/realtor", this.verifyIfUserIsAuthenticated, this.verifyIfUserIsMaster, this._createRealtorUser);
        router.put("/update-profile/realtor", this.verifyIfUserIsAuthenticated, this.verifyIfUserIsMaster, this._updateRealtorPersonalInfos);
        router.put("/update-password/realtor", this.verifyIfUserIsAuthenticated, this.verifyIfUserIsMaster, this._updateRealtorPassword);
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

    private async _viewAllRealtorUsers(req: Request, res: Response) {
        const { name, email, telephone } = req.query;

        try {
            const data = await User.getOneTypeOfUsers("REALTOR", name?.toString(), email?.toString(), telephone?.toString());

            return res.status(200).json({ data });
        } catch (err) {
            return res.status(500).json({ error: (err as errors).message });
        }
    }

    private async _viewAllUsers(req: Request, res: Response) {
        const { name, email, telephone } = req.query;

        try {
            const data = await User.getOneTypeOfUsers("USER", name?.toString(), email?.toString(), telephone?.toString());

            return res.status(200).json({ data });
        } catch (err) {
            return res.status(500).json({ error: (err as errors).message });
        }
    }

    private async _getUniqueUser(req: Request, res: Response) {
        const { userId } = req.query;

        try {
            if(typeof userId === "string") {
                const data = await User.getOneUserById(userId);

                return res.status(200).json({ data });

            } else {
                const error: errors = new Error("The 'userId' parameter is required and must be provided.");
                error.code = 400;
                throw error;
            }

        } catch (err) {
            let { code } = err as errors;

            if(!code) {
                code = 500;
            }

            return res.status(code).json({ error: (err as errors).message });
        }
    }

    private async _updateRealtorPersonalInfos(req: Request, res: Response) {
        const { userId, name, email, telephone } = req.body;

        try {
            const data = await User.getOneUserById(userId);
            if(data?.role === "REALTOR") {
                const user = new User(name ?? data.name, email ?? data.email, telephone ?? data.telephone, "[NullPassword1]", data.role);
                await user.updateUserProfile(userId);

                return res.status(200).json({ message: "User successfully updated" });

            } else throw new Error("The user are not a realtor");
        } catch (err) {
            return res.status(400).json({ error: (err as errors).message });
        }
    }

    private async _updateRealtorPassword(req: Request, res: Response) {
        const { userId, newPassword, masterPassword } = req.body;
        const { id } = req.user; // Master ID
        try {
            const userData = await User.getOneUserById(userId);

            if (userData?.role === "REALTOR") {
                const user = new User(userData.name, userData.email, userData.telephone, newPassword, "REALTOR");
                await user.updateLoggedUserPassword(id, masterPassword);

                return res.status(200).json({ message: "Password successfully updated." });
            } else throw new Error("The user are not a realtor");
        } catch (err) {
            return res.status(400).json({ error: (err as errors).message });
        }
    }
}
