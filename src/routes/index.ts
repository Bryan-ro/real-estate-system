import { Application } from "express-serve-static-core";
import router from "./router";

export default (app: Application) => {
    app.use(router)
}