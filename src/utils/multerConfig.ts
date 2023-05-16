import path from "path";
import multer from "multer";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `${process.env.IMAGE_URL}`));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        cb(null, uuid() + ext);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if(file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else cb(new Error("Invalid file format. The file must be in PNG or JPEG format."));
    }
});

