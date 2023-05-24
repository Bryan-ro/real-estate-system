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
        router.post("/upload-newImage/:id", upload.single("image"), this._addImageInImmobile);
        router.put("/update-immobile/:id", immobileMiddleware.validadeImmobilePropsToUpdate, this._updateImmobile);

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

            if(imagesUrl.length < 1) return res.status(400).json({ error: "At least one image is required" });

            await immobile.createImmobile();

            return res.status(201).json({ message: "Immobile successfully created" });
        } catch (err) {
            res.status(500).json({ error: (err as errors).message });
        }
    }

    private async _updateImmobile (req: Request, res: Response) {
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
        } = req.immobile;

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
                postalCode
            );

            await immobile.updateImmobile(id);

            return res.status(200).json({ message: "Immobile successfully updated." });
        } catch (err) {
            return res.status(500).json({ error: "Uncknow error" });
        }
    }

    private async _addImageInImmobile(req: Request, res: Response) {
        const ImmobileId = req.params.id;

        const image = req.file;

        try {
            if(!image) return res.status(400).json({ error: "You need to upload one image" });

            await Immobile.addImageInImmobile(ImmobileId, image.toString());

            return res.status(200).json({ message: "Image successfully uploaded" });
        } catch (err) {
            return res.status(500).json({ err });
        }



    }
}
