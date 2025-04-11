import { Router } from "express";
import { UserController } from "./User.controllers";

const router = Router();

router.post("/create-admin", UserController.createAdmin);

export const UserRoutes = router;
