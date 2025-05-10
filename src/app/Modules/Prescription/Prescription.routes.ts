import { Router } from "express";
import { PrescriptionControllers } from "./Prescription.controllers";

const router = Router();
router.post("/create", PrescriptionControllers.createPrescription);

export const PrescriptionRoutes = router;
