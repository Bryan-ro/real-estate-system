import { MasterController } from "../controllers/userControllers/MasterController";
import { Router } from "express";
const Master = new MasterController();
const router = Router();

router.use("/managemanagement/users", Master.routes());

export default router;
