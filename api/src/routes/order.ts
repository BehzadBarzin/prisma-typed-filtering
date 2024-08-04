import { Router } from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
} from "../controllers/order";
import authMiddleware from "../middlewares/auth";

const orderRouter = Router();

orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrder);
orderRouter.post("/", authMiddleware, createOrder);
orderRouter.patch("/:id", authMiddleware, updateOrder);

export { orderRouter };
