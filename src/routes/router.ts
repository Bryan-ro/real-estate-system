import { Router } from "express";
import { MasterController } from "../controllers/userControllers/MasterController";
import { AllUserController } from "../controllers/userControllers/AllUserController";
import { UserController } from "../controllers/userControllers/UserController";
import { ImmobileController } from "../controllers/immobileControllers/ImmobileController";
const master = new MasterController();
const allUser = new AllUserController();
const user = new UserController();
const immobile = new ImmobileController();
const router = Router();

router.use("/user/all", allUser.routes());
router.use("/managemanagement/users", master.routes());
router.use("/user", user.routes());
router.use("/immobiles", immobile.routes());

export default router;
