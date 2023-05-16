import { Request, Response, Router } from "express";
import { Immobile } from "../../services/Immobile";
import { AuthMiddleware } from "../../middlewares/AuthMiddlewares";
import { ImmobileMidleware } from "../../middlewares/ImmobileMiddleware";
import { upload } from "../../utils/multerConfig";
const immobileMiddleware = new ImmobileMidleware();
const router = Router();

export class ImmobileController extends AuthMiddleware {
    public routes() {
        router.get("/view-immobiles", this._getImmobilesFiltered);
        router.post("/create-immobile", upload.array("images", 5), immobileMiddleware.validadeImmobileProps, this._createImmobile);


        return router;
    }

    private async _getImmobilesFiltered(req: Request, res: Response) {
        const { filter } = req.query;
        try {
            const immobiles = await Immobile.getAllImmobilesWithFilters(filter?.toString());

            return res.json(immobiles);
        } catch (err) {
            res.status(500).json({ error: "Uncknow error" });
        }

    }

    private async _createImmobile (req: Request, res: Response) {
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
        } = req.immobile;

        const images = req.files;
        const imagesUrl: immobile.images[] = [];

        if(Array.isArray(images)) {
            images.map(image => {
                console.log(image.filename);
                imagesUrl.push({ image: image.filename });
            });
        }

        try {
            const immobile = new Immobile(
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
                postalCode,
                imagesUrl
            );

            await immobile.createImmobile();

            return res.status(201).json({ message: "Immobile successfully created" });
        } catch (err) {
            res.status(500).json({ error: (err as errors).message });
        }
    }
}
