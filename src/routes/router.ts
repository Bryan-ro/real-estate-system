import { MasterController } from "../controllers/userControllers/MasterController";
import { AllUserController } from "../controllers/userControllers/AllUserController";
import { UserController } from "../controllers/userControllers/UserController";
import { Router } from "express";
const master = new MasterController();
const allUser = new AllUserController();
const user = new UserController();
const router = Router();

router.use("/user/all", allUser.routes());
router.use("/managemanagement/users", master.routes());
router.use("/user", user.routes());

export default router;
