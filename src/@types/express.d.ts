declare namespace Express {
    interface Request {
        user: {
            id: string;
            email: string;
            name?: string;
            telephone?: string;
        },
        image: {
            fileName: string;
        },
        immobile: {
            title: string;
            contractType: contractType,
            category: category,
            price: number,
            highlights: boolean = false,
            area: number,
            quantBedrooms: number,
            quantBathrooms: number,
            garage: boolean = false,
            description: string,
            street: string,
            number: number,
            city: string,
            state: string,
            postalCode: string,
        }
    }
}
