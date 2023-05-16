declare namespace immobile {
    type contractType = "SALE" | "RENT";
    type category = "HOUSE" | "APARTMENT" | "GROUND";
    type images = { image: string }

    interface immobileProps {
        title: string,
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
        images?: images[]
    }
}
