import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { Immobile } from "../services/Immobile";
import { ImmobilePropsValidation } from "../validations/ImmobilePropsValidation";
dotenv.config();
const validateImmobile = new ImmobilePropsValidation();

export class ImmobileMidleware {
    public async validadeImmobileProps (req: Request, res: Response, next: NextFunction) {
        const {
            title,
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
        const images = req.files;


        if(!highlights) highlights = "false";
        if(!garage) garage = "false";
        const filerContractType = contractType.toUpperCase();
        const filterCategory = category.toUpperCase();
        const filterPostalCode = postalCode.replace(/-/g, "");
        const filterHightlight = highlights === "true";
        const filterGarage = garage === "true";

        const validations = validateImmobile.validations(
            title,
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
            (images as multer.images[]).map(image => {
                fs.unlink(path.join(__dirname, `${process.env.IMAGE_URL}/${image.filename}`), (err) => {
                    if(err) console.log(err);
                });
            });

            return res.status(400).json({ error: validations });
        }

        const address = await Immobile.getAddressByPostalCode(filterPostalCode);

        let ifRepeat = false;

        address.map(address => {
            if(address.number === parseInt(number)) {
                (images as multer.images[]).map(image => {
                    fs.unlink(path.join(__dirname, `${process.env.IMAGE_URL}/${image.filename}`), (err) => {
                        err;
                    });
                });

                ifRepeat = true;
            }
        });

        if(ifRepeat) return res.status(409).json({ error: "Address already exists. We're sorry, but the address you provided is already associated with another property in our database. Please check your input and ensure that the address is unique. If you believe this is an error or if you have any further questions, please contact our support for assistance." });

        req.immobile = {
            title: title,
            contractType: filerContractType,
            category: filterCategory,
            price: parseFloat(price),
            highlights: filterHightlight,
            area: parseInt(area),
            quantBedrooms: parseInt(quantBedrooms),
            quantBathrooms: parseInt(quantBathrooms),
            description,
            garage: filterGarage,
            street,
            number: parseInt(number),
            city,
            state,
            postalCode: filterPostalCode
        };
        return next();
    }



    public async validadeImmobilePropsToUpdate (req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const {
            title,
            contractType,
            category,
            price,
            highlights,
            area,
            quantBedrooms,
            quantBathrooms,
            garage,
            description,
            street,
            number,
            city,
            state,
            postalCode
        } = req.body;

        const filterPostalCode = postalCode.replace(/-/g, "");

        const immobileProps = await Immobile.getImmobilesById(id);

        if(!immobileProps) return res.status(400).json({ status: "This immobile does not exists." });

        const validations = validateImmobile.validationsToUpdate(
            title ?? immobileProps.title,
            contractType ?? immobileProps.contractType,
            category ?? immobileProps.category,
            street ?? immobileProps.adress.street,
            city ?? immobileProps.adress.city,
            state ?? immobileProps.adress.state,
            filterPostalCode ?? immobileProps.adress.postalCode
        );

        if(validations.length > 0) return res.status(400).json({ error: validations });

        if(price || area || quantBedrooms || quantBathrooms || number) {
            if(typeof price !== "number" || typeof area !== "number" || typeof quantBedrooms !== "number" || typeof quantBathrooms !== "number" || typeof number !== "number")
                return res.status(400).json({ error: "Type of the fields price, area, quantBedrooms, quantBathrooms and number, must to be a number." });
        }

        if(garage || highlights) {
            if(typeof garage !== "boolean" || typeof highlights !== "boolean") return res.status(400).json({ error: "The tyoe if fields garage and highlights must to be boolean." });
        }


        req.immobile = {
            title: title ?? immobileProps.title,
            contractType: contractType ?? immobileProps.contractType,
            category: category ?? immobileProps.category,
            price: price,
            highlights: highlights ?? immobileProps.highlights,
            area: area ?? immobileProps.property.area,
            quantBedrooms: quantBathrooms ?? immobileProps.property.quantBedrooms,
            quantBathrooms: quantBathrooms ?? immobileProps.property.quantBathrooms,
            description: description ?? immobileProps.property.description,
            garage: garage ?? immobileProps.property.garage,
            street: street ?? immobileProps.adress.street,
            number: number ?? immobileProps.adress.number,
            city: city ?? immobileProps.adress.city,
            state: state ?? immobileProps.adress.state,
            postalCode: filterPostalCode ?? immobileProps.adress.postalCode
        };


        return next();
    }
}

