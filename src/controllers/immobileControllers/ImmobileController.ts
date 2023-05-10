import { Request, Response, Router } from "express";
import { Immobile } from "../../services/Immobile";
import { AuthMiddleware } from "../../middlewares/AuthMiddlewares";
import { ImmobileMidleware } from "../../middlewares/ImmobileMiddleware";
import { upload, transform } from "../../utils/multerConfig";
const immobileMiddleware = new ImmobileMidleware();
const router = Router();

export class ImmobileController extends AuthMiddleware {
    public routes() {
        router.post("/create-immobile", transform.array("images"), immobileMiddleware.validadeImmobileProps, upload.array("images", 5), this._createImmobile);

        return router;
    }

    private async _createImmobile (req: Request, res: Response) {
        const {
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

        const images = req.files;
        const imagesUrl: immobile.images[] = [];

        if(Array.isArray(images)) {
            images.map(image => {
                imagesUrl.push({ image: image.originalname });
            });
        }

        try {
            const immobile = new Immobile(
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
                postalCode,
                imagesUrl
            );

            // await immobile.createImmobile();

            return res.status(201).json({ message: "Immobile successfully created" });
        } catch (err) {
            res.status(500).json({ error: (err as errors).message });
        }
    }
}
