import { Request } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/images"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        cb(null, uuid() + ext);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 300 * 1024
    },
    fileFilter: (req, file, cb) => {
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(new Error("Invalid type or size"));
        }
    }
});
