import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Immobile {
    constructor(
        private _contractType: immobile.contractType,
        private _category: immobile.category,
        private _price: string,
        private _highlights: boolean = false,
        private _area: string,
        private _quantBedrooms: string,
        private _quantBathrooms: string,
        private _garage: boolean = false,
        private _description: string,
        private _street: string,
        private _number: string,
        private _city: string,
        private _state: string,
        private _postalCode: string,
        private _images: immobile.images[]
    ) { }

    public static async getAdressByPostalCode(postalCode: string) {
        const immobile = await prisma.adress.findMany({
            where: {
                postalCode: postalCode
            }
        });

        return immobile;
    }



    public async createImmobile(): Promise<void> {
        const adress = await prisma.adress.create({
            data: {
                street: this._street,
                number: parseInt(this._number),
                city: this._city,
                state: this._state,
                postalCode: this._postalCode
            }
        });

        const property = await prisma.immobileProperty.create({
            data: {
                area: parseInt(this._area),
                quantBedrooms: parseInt(this._quantBedrooms),
                quantBathrooms: parseInt(this._quantBathrooms),
                garage: this._garage,
                description: this._description
            }
        });


        await prisma.immobile.create({
            data: {
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
