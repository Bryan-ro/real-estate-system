import { PrismaClient } from "@prisma/client";
import { Auth } from "../utils/AuthUtils";
import { UserPropsValitations } from "../validations/UserPropsValidations";
const prisma = new PrismaClient();
const auth = new Auth();

export class User extends UserPropsValitations {
    constructor(
		private _name: string,
		private _email: string,
		private _telephone: string,
		private _password: string,
		private _role: "USER" | "REALTOR" = "USER"
    ){
        super();
    }

    public static async getUserByEmail(emailOrTel: string) {
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
                name: true,
                email: true,
                telephone: true,
            }
        });

        return data;
    }

    public async createUser(): Promise<void> {
        const validations = this._validadeUserProps();

        if(validations) {
            await prisma.user.create({
                data: {
                    name: this._name,
                    email: this._email,
                    telephone: this._telephone,
                    password: await auth.hashPassword(this._password),
                    role: this._role
                }
            });
        } else {
            throw new Error("Not validated fields");
        }
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
            }

        }
    }

    private _validadeUserProps(): boolean {
        if (this.validateName(this._name) &&
        this.validateEmail(this._email) &&
        this.validateTelephone(this._telephone) &&
        this.validatePassword(this._telephone)) {
            return true;
        } else return false;

    }
}
