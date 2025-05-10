import { Router } from "express";
import { PaymentControllers } from "./Payment.controllers";

const router = Router();

router.get("/ipn", PaymentControllers.validatePayment);
// Init Payment Route
router.post("/init-payment/:appointmentId", PaymentControllers.initPayment);

export const PaymentRoutes = router;
