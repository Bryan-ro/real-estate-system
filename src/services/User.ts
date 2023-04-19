import { PrismaClient } from "@prisma/client";
import { Auth } from "../utils/AuthUtils";
import { UserPropsValidations } from "../validations/UserPropsValidations";
const prisma = new PrismaClient();
const auth = new Auth();

export class User extends UserPropsValidations {
    constructor(
		private _name: string,
		private _email: string,
		private _telephone: string,
		private _password: string,
		private _role: "USER" | "REALTOR" = "USER"
    ){
        super();
    }

    public static async getUserByEmailOrTelephone(emailOrTel: string) {
        const data = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: {
                            equals: emailOrTel
                        }
                    },
                    {
                        telephone: {
                            equals: emailOrTel
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                telephone: true,
                role: true
            }
        });
        if (!data) {
            throw new Error("Invalid credentials. Please check your login and password.");
        }
        return data;
    }

    public async createUser(): Promise<void> {
        this._validadeUserProps();
        await prisma.user.create({
            data: {
                name: this._name,
                email: this._email,
                telephone: this._telephone,
                password: await auth.hashPassword(this._password),
                role: this._role
            }
        });
    }

    public async login(): Promise<string | void> {
        const data = await prisma.user.findUnique({
            where: {
                email: this._email
            }
        });

        if (data) {
            const compare: boolean = await auth.compare(this._password, data.password);

            if (compare) {
                return auth.generateJwtToken({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    telephone: data.telephone
                });
            } else throw new Error("Invalid credentials. Please check your login and password.");

        } else throw new Error("Invalid credentials. Please check your login and password.");
    }

    private _validadeUserProps(): void {
        this.validateName(this._name);
        this.validateEmail(this._email);
        this.validateTelephone(this._telephone);
        this.validatePassword(this._password);
    }
}
