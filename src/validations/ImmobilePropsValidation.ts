export class ImmobilePropsValidation {
    public validations (
        title: string,
        contractType: string,
        category: string,
        price: string,
        highlights: string,
        area: string,
        quantBedrooms: string,
        quantBathrooms: string,
        garage: string,
        street: string,
        number: string,
        city: string,
        state: string,
        postalCode: string
    ) {
        const errors: string[] = [];

        errors.push(this.validateTitle(title) ?? "");
        errors.push(this.validateContractType(contractType) ?? "");
        errors.push(this.validateCategory(category) ?? "");
        errors.push(this.validatePrice(price) ?? "");
        errors.push(this.validateHighlights(highlights) ?? "");
        errors.push(this.validateArea(area) ?? "");
        errors.push(this.validateQuantBedrooms(quantBedrooms) ?? "");
        errors.push(this.validateQuantBathrooms(quantBathrooms) ?? "");
        errors.push(this.validateGarage(garage) ?? "");
        errors.push(this.validateStreet(street) ?? "");
        errors.push(this.validateNumber(number) ?? "");
        errors.push(this.validateCity(city) ?? "");
        errors.push(this.validateState(state) ?? "");
        errors.push(this.validatePostalCode(postalCode) ?? "");

        const errorsFilter = errors.filter(itens => itens !== "");

        return errorsFilter;
    }

    public validationsToUpdate (
        title: string,
        contractType: string,
        category: string,
        street: string,
        city: string,
        state: string,
        postalCode: string
    ) {
        const errors: string[] = [];

        errors.push(this.validateTitle(title) ?? "");
        errors.push(this.validateContractType(contractType) ?? "");
        errors.push(this.validateCategory(category) ?? "");
        errors.push(this.validateStreet(street) ?? "");
        errors.push(this.validateCity(city) ?? "");
        errors.push(this.validateState(state) ?? "");
        errors.push(this.validatePostalCode(postalCode) ?? "");

        const errorsFilter = errors.filter(itens => itens !== "");

        return errorsFilter;
    }


    private validateTitle(title: string) {
        if(!title || title.length > 50 || title.length < 5) {
            return "The title must be at least 50 characters and more than 5";
        }
    }

    private validateContractType(contractType: string) {
        const regex = /^(SALE|RENT)$/;

        if (!regex.test(contractType)) {
            return "The 'contractType' field must be 'SALE' or 'RENT'";
        }
    }

    private validateCategory(category: string) {
        const regex = /^(HOUSE|APARTMENT|GROUND)$/;

        if (!regex.test(category)) {
            return "The 'category' field must be 'HOUSE', 'APARTMENT', or 'GROUND'";
        }
    }

    private validatePrice(price: string) {
        const regex = /^\d+(\.\d+)?$/;

        if (!regex.test(price)) {
            return "The 'price' field must be a valid number";
        }
    }

    private validateHighlights(highlights: string) {
        const regex = /^(true|false)$/;

        if (!regex.test(highlights)) {
            return "The 'highlights' field must be 'true' or 'false'";
        }
    }

    private validateArea(area: string) {
        const regex = /^\d+(\.\d+)?$/;

        if (!regex.test(area)) {
            return "The 'area' field must be a valid number";
        }
    }

    private validateQuantBedrooms(quantBedrooms: string) {
        const regex = /^\d+$/;

        if (!regex.test(quantBedrooms)) {
            return "The 'quantBedrooms' field must be a positive integer";
        }
    }

    private validateQuantBathrooms(quantBathrooms: string) {
        const regex = /^\d+$/;

        if (!regex.test(quantBathrooms)) {
            return "The 'quantBathrooms' field must be a positive integer";
        }
    }

    private validateGarage(garage: string) {
        const regex = /^(true|false)$/;

        if (!regex.test(garage)) {
            return "The 'garage' field must be 'true' or 'false'";
        }
    }

    private validateStreet(street: string) {
        const regex = /^[A-Za-z\s]+$/;

        if (!regex.test(street)) {
            return "The 'street' field must only contain letters and spaces";
        }
    }

    private validateNumber(number: string) {
        const regex = /^\d+$/;

        if (!regex.test(number)) {
            return "The 'number' field must be a positive integer";
        }
    }

    private validateCity(city: string) {
        const regex = /^[A-Za-z\s]+$/;

        if (!regex.test(city)) {
            return "The 'city' field must only contain letters and spaces";
        }
    }

    private validateState(state: string) {
        const regex = /^[A-Za-z]{2}$/;

        if (!regex.test(state)) {
            return "The 'state' field must be a valid state abbreviation ('SP', 'BA', 'RJ')";
        }
    }

    private validatePostalCode(postalCode: string) {
        const regex = /^\d{8}$/;

        if (!regex.test(postalCode)) {
            return "The 'postalCode' field must be an 8-digit number";
        }
    }
}
