import { Router } from "express";
import { AdminController } from "./Admin.controller";

const router = Router();

router.get("/", AdminController.getAllAdmins);
router.get("/:id", AdminController.getSingleAdmin);
router.patch("/:id", AdminController.updateAdmin);
router.delete("/:id", AdminController.deleteAdmin);
router.delete("/remove/:id", AdminController.softDeleteAdmin);

export const AdminRoutes = router;
