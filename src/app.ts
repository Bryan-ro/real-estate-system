import express from "express";
import router from "./routes/index";
import { Logs } from "./utils/Logs";
const logs = new Logs();
const app = express();
app.use(express.json());

logs.storeLog(app);
router(app);



app.listen(4444, () => console.log("Server listening on port 4444"));
