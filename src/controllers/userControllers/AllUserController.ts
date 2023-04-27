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
        router.post("/auth/login", this._login);
        router.post("/auth/forgetpassword/request-token", this._requestPasswordChange);
        router.post("/auth/forgetpassword/verify-token", this._validateVerificationCode);
        router.put("/auth/forgetpassword/change-password", this.verifyTokenToChangePassword, this._changeForgottenPassword);
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
     *  - The methods below are user profile setup, where the user himself can update personal information and passwords. But already logged into the account.
     *
     * Português:
     *  - Os métodos abaixo são de configuração do perfil do usuário, onde o próprio usuário pode atualizar informações pessoais e senha, mas já estando logado na conta.
     */

    private changePassword (req: Request, res: Response) {
        const { id } = req.user;
        const { currentPassword, newPassword } = req.body;

        // Method to be fineshed.
    }
}
