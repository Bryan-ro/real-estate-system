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
}

