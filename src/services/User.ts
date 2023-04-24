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
    ) {
        super();
    }

    private _validadeUserProps(): void {
        this.validateName(this._name);
        this.validateEmail(this._email);
        this.validateTelephone(this._telephone);
        this.validatePassword(this._password);
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
                return auth.generateJwtTokenToLogin({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    telephone: data.telephone
                });
            } else throw new Error("Invalid credentials. Please check your login and password.");

        } else throw new Error("Invalid credentials. Please check your login and password.");
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

        return data;
    }

    public static async getOneTypeOfUsers(role: "USER" | "REALTOR", name?: string, email?: string, telephone?: string) {
        const data = await prisma.user.findMany({
            where: {
                AND: [
                    { role },
                    {
                        AND: [
                            {
                                email: {
                                    contains: email
                                }
                            },
                            {
                                telephone: {
                                    contains: telephone
                                }
                            },
                            {
                                name: {
                                    contains: name
                                }
                            }
                        ]
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

        return data;
    }

    public static async getOneUserById(id: string) {
        const data = await prisma.user.findUnique({
            where: {
                id
            }, select: {
                id: true,
                name: true,
                email: true,
                telephone: true,
                role: true
            }
        }).catch(() => {
            throw new Error("The 'userId' parameter is required and must be provided.");
        });

        return data;


    }

    public async updateUserProfile(id: string): Promise<void> {
        this._validadeUserProps();

        await prisma.user.update({
            where: {
                id
            },
            data: {
                name: this._name,
                email: this._email,
                telephone: this._telephone
            }
        });
    }

    public async updateLoggedUserPassword(masterId: string, masterPlainTextPassword: string): Promise<void> {
        this._validadeUserProps();
        const currentUserData = await prisma.user.findUnique({
            where: {
                id: masterId,
            }
        });

        if(currentUserData) {
            const validation = await auth.compare(masterPlainTextPassword, currentUserData.password);
            if(!validation) throw new Error("Current password does not match");

            await prisma.user.update({
                where: {
                    email: this._email
                },
                data: {
                    password: await auth.hashPassword(this._password)
                }
            });
        }
    }

    public async updateForgotUserPassword(masterId: string, masterPlainTextPassword: string): Promise<void> {
        this._validadeUserProps();

        await prisma.user.update({
            where: {
                email: this._email
            },
            data: {
                password: await auth.hashPassword(this._password)
            }
        });

    }
}
