import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Immobile {
    constructor(
        private _title: string,
        private _contractType: immobile.contractType,
        private _category: immobile.category,
        private _price: number,
        private _highlights: boolean = false,
        private _area: number,
        private _quantBedrooms: number,
        private _quantBathrooms: number,
        private _garage: boolean = false,
        private _description: string,
        private _street: string,
        private _number: number,
        private _city: string,
        private _state: string,
        private _postalCode: string,
        private _images?: immobile.images[]
    ) {}

    public static async getAllImmobilesWithFilters(filter?: string) {
        const immobiles = await prisma.immobile.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: filter
                        }
                    },
                    {
                        adress: {
                            city: {
                                contains: filter
                            }
                        }
                    },
                    {
                        adress: {
                            state: {
                                contains: filter
                            },
                        }
                    },
                    {
                        adress: {
                            street: {
                                contains: filter
                            }
                        }
                    },
                    {
                        property: {
                            description: {
                                contains: filter
                            }
                        }
                    }
                ]
            },
            include: {
                adress: true,
                images: true,
                property: true
            }
        });

        return immobiles;
    }

    public static async getAddressByPostalCode(postalCode: string) {
        const address = await prisma.address.findMany({
            where: {
                postalCode: postalCode
            }
        });

        return address;
    }

    public static async getImmobilesById(id: string) {
        const immobile = await prisma.immobile.findUnique({
            where: {
                id: id
            },
            include: {
                adress: true,
                property: true
            }
        });

        return immobile;
    }



    public async createImmobile(): Promise<void> {
        const adress = await prisma.address.create({
            data: {
                street: this._street,
                number: this._number,
                city: this._city,
                state: this._state,
                postalCode: this._postalCode
            }
        });

        const property = await prisma.immobileProperty.create({
            data: {
                area: this._area,
                quantBedrooms: this._quantBedrooms,
                quantBathrooms: this._quantBathrooms,
                garage: this._garage,
                description: this._description
            }
        });

        if(this._images) {
            await prisma.immobile.create({
                data: {
                    title: this._title,
                    contractType: this._contractType,
                    category: this._category,
                    price: this._price,
                    highlights: this._highlights,
                    adressId: adress.id,
                    propertyId: property.id,
                    images: {
                        createMany: {
                            data: this._images
                        }
                    }
                }
            });
        }
    }

    public async updateImmobile(id: string) {
        await prisma.immobile.update({
            where: {
                id
            },
            data: {
                title: this._title,
                contractType: this._contractType,
                category: this._category,
                price: this._price,
                highlights: this._highlights,
                property: {
                    update: {
                        area: this._area,
                        quantBedrooms: this._quantBedrooms,
                        quantBathrooms: this._quantBathrooms,
                        garage: this._garage,
                        description: this._description
                    }
                },
                adress: {
                    update: {
                        street: this._street,
                        number: this._number,
                        city: this._city,
                        state: this._state,
                        postalCode: this._postalCode
                    }
                }

            }
        });
    }

    public static async addImageInImmobile(immobileId: string, image: string): Promise<void> {
        await prisma.image.create({
            data: {
                image: image,
                immobileId: immobileId,
            }
        });
    }
}
