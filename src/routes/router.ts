import { MasterController } from "../controllers/userControllers/MasterController";
import { AllUserController } from "../controllers/userControllers/AllUserController";
import { Router } from "express";
const Master = new MasterController();
const User = new AllUserController();
const router = Router();

router.use("/managemanagement/users", Master.routes());
router.use("/user", User.routes());

export default router;
