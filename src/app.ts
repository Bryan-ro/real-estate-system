import path from "path";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import router from "./routes/index";
import { Logs } from "./utils/LogsConfig";

const logs = new Logs();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "../public/images")));

logs.storeLog(app);
router(app);

app.use((err: errors, req: Request, res: Response, next: NextFunction) => {
    if (err.message === "File too large") return res.status(415).json({ error: "The file is too large. Please make sure the file size is less than 1MB." });
    if(err.message === "Invalid file format. The file must be in PNG or JPEG format.") return res.status(415).json({ error: err.message });

    next(err);
});


app.listen(4444, () => console.log("Server listening on port 4444"));
