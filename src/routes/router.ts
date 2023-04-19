import { MasterController } from "../controllers/userControllers/MasterController";
import { UserController } from "../controllers/userControllers/UserController";
import { Router } from "express";
const Master = new MasterController();
const User = new UserController();
const router = Router();

router.use("/managemanagement/users", Master.routes());
router.use("/user", User.routes());

export default router;
