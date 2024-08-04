import { Router } from "express";
import {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
} from "../controllers/payment";
import authMiddleware from "../middlewares/auth";

const paymentRouter = Router();

paymentRouter.get("/", getPayments);
paymentRouter.get("/:id", getPayment);
paymentRouter.post("/", authMiddleware, createPayment);
paymentRouter.patch("/:id", authMiddleware, updatePayment);

export { paymentRouter };
