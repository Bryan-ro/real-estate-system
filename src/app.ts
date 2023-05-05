import express from "express";
import router from "./routes/index";
import { Logs } from "./utils/LogsConfig";
import path from "path";

const logs = new Logs();
const app = express();
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "../public/images")));

logs.storeLog(app);
router(app);

app.listen(4444, () => console.log("Server listening on port 4444"));
