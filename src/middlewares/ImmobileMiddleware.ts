import { Request, Response, NextFunction } from "express";
import { Immobile } from "../services/Immobile";
import { ImmobilePropsValidation } from "../validations/ImmobilePropsValidation";
const validateImmobile = new ImmobilePropsValidation();

export class ImmobileMidleware {
    public async validadeImmobileProps (req: Request, res: Response, next: NextFunction) {
        const {
            contractType,
            category,
            price,
            area,
            quantBedrooms,
            quantBathrooms,
            description,
            street,
            number,
            city,
            state,
            postalCode
        } = req.body;

        let { garage, highlights } = req.body;
        const filerContractType = contractType.toUpperCase();
        const filterCategory = category.toUpperCase();
        const filterPostalCode = postalCode.replace(/-/g, "");


        try {
            if(!highlights) highlights = "false";
            if(!garage) garage = "false";

            const validations = validateImmobile.validations(
                filerContractType,
                filterCategory,
                price,
                highlights,
                area,
                quantBedrooms,
                quantBathrooms,
                garage,
                street,
                number,
                city,
                state,
                filterPostalCode
            );

            if(validations.length > 0) {
                return res.status(200).json({ error: validations });
            } else {
                // To be finished
                //Preciso criar uma tipagem do req.immobile para passar as informações para a controler já validadas e prontas para o banco de dados.

            }

            const address = await Immobile.getAdressByPostalCode(postalCode);

            address.map(address => {
                if(address.number === parseInt(number)) {
                    return res.status(409).json({ error: "Address already exists. We're sorry, but the address you provided is already associated with another property in our database. Please check your input and ensure that the address is unique. If you believe this is an error or if you have any further questions, please contact our support for assistance." });
                }
            });



        } catch(err) {
            return res.status(500).json({ error: err });
        }
    }
}

