import { User } from "../../services/User";
import { AuthMiddleware } from "../../middlewares/authMiddlewares";
import { ServerCache } from "../../services/ServerCacheMethods";
import { Request, Response, Router } from "express";
const serverCache = new ServerCache();
const router = Router();


export class AllUserController extends AuthMiddleware{
    /*
     * English:
     *  - The AllUserController class, is defining common routes for all users, be it MASTER, REALTOR or USER.
     *
     * Português:
     *  - A classe AllUsersControllers, está definindo as rotas em comum para todos os usuarios, seja ele MASTER, REALTOR ou USER.
     */
    public routes() {
        // Routes for login and forget password.
        router.post("/auth/login", this._login);
        router.post("/auth/forgetpassword/request-token", this._requestPasswordChange);
        router.post("/auth/forgetpassword/verify-token", this._validateVerificationCode);
        router.put("/auth/forgetpassword/change-password", this.verifyTokenToChangePassword, this._changeForgottenPassword);

        // Router for profile config.
        router.get("/profile", this.verifyIfUserIsAuthenticated, this._seeYourOwnProfileInfo);
        router.put("/profile/update-personalInfos", this.verifyIfUserIsAuthenticated, this._updatePersonalInfos);
        router.put("/profile/change-password", this.verifyIfUserIsAuthenticated, this._changePassword);
        return router;
    }

    private async _login(req: Request, res: Response) {
        const { login, password } = req.body;
        try {
            const data = await User.getUserByEmailOrTelephone(login);
            if (data) {
                const user = new User(data.name, data.email, data.telephone, password);

                const token = await user.login();

                return res.status(200).json({ authorization: token });
            } else throw new Error("Invalid credentials. Please check your login and password.");
        } catch (err) {
            const { message } = err as errors;
            res.status(401).json({ error: message });
        }
    }

    /*
     * English:
     *  - The 3 methods below are for changing the password, only for users who have forgotten the password.
     *
     *  Português:
     *  - Os 3 metodos abaixo, são para alteração de senha, apenas para usuarios que tenham esquecido a senha.
     */

    private async _requestPasswordChange(req: Request, res: Response) {
        const { credentials } = req.body; // Email or telephone

        try {
            const user = await User.getUserByEmailOrTelephone(credentials);
            if (user) {
                await serverCache.putVerificationCode(user.email, user.name);
                return res.status(200).json({ message: "The verification code has been sent to the email" });
            } else throw new Error("User does not exist");

        } catch (err) {
            let status = 500;
            if ((err as errors).message === "User does not exist") status = 404;

            return res.status(status).json({ error: (err as errors).message });
        }
    }

    private async _validateVerificationCode(req: Request, res: Response) {
        const { credentials, code } = req.body; // Email or telephone

        try {
            const userData = await User.getUserByEmailOrTelephone(credentials);
            if (!userData) throw new Error("Invalid email");

            const validation = await serverCache.getVerificationCode(userData.email, code, {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                telephone: userData.telephone
            });

            return res.status(200).json({ authorization: validation });

        } catch (err) {
            return res.status(401).json({ error: (err as errors).message });
        }
    }

    private async _changeForgottenPassword(req: Request, res: Response) {
        const { name, email, telephone } = req.user;
        const { password } = req.body; // New password
        try {
            if (name && telephone) {
                const user = new User(name, email, telephone, password);
                await user.updateForgotUserPassword();

                return res.status(200).json({ message: "Password Successfully updated" });
            }
        } catch(err) {
            return res.status(401).json({ error: (err as errors).message });
        }
    }
    /*
     * English:
     *  - The methods below are user profile setup, where the user himself can see and update personal information and passwords. But already logged into the account.
     *
     * Português:
     *  - Os métodos abaixo são de configuração do perfil do usuário, onde o próprio usuário pode atualizar informações pessoais e senha, mas já estando logado na conta.
     */

    private async _seeYourOwnProfileInfo (req: Request, res: Response) {
        const { id } = req.user;

        if(!id) {
            const error: errors = new Error("The 'id' parameter is required and must be provided.");
            error.code = 400;
            throw error;
        }

        try {
            const user = await User.getOneUserById(id);
            if(user) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { role, ...userProfile } = user; // Romove the role of user.

                return res.status(200).json({ userProfile });
            }
        } catch (err) {
            let { code } = err as errors;

            if(!code) {
                code = 500;
            }

            return res.status(code).json({ error: (err as errors).message });
        }
    }


    private async _updatePersonalInfos(req: Request, res: Response) {
        const { id, name, email, telephone } = req.user;
        const { newName, newEmail, newTelephone } = req.body;

        try {
            if(name && email && telephone) {
                const user = new User(newName ?? name, newEmail ?? email, newTelephone ?? telephone, "[NullPassword1]");
                await user.updateUserProfile(id);

                return res.status(200).json({ message: "User successfully updated" });

            } else throw new Error("Invalid User");
        } catch (err) {
            return res.status(400).json({ error: (err as errors).message });
        }
    }

    private async _changePassword (req: Request, res: Response) {
        const { id, email, name, telephone } = req.user;
        const { currentPassword, newPassword } = req.body;

        try {
            console.log(id, name, email, telephone);
            if(name && email && telephone) {
                const user = new User(name, email, telephone, newPassword);

                await user.updateLoggedUserPassword(id, currentPassword);

                return res.status(200).json({ message: "Password successfully updated." });
            } else {
                const error: errors = new Error("Invalid User.");
                error.code = 401;
                throw error;
            }

        } catch (err) {
            let { code } = err as errors;

            if(!code) {
                code = 500;
            }
            return res.status(code).json({ message: (err as errors).message });
        }
    }
}
