import { Request, RequestHandler, Response } from "express";
import { prisma } from "../utils/prisma";

// =============================================================================
const getOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany();
  res.json(orders);
};

// =============================================================================
const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid order id" });
  }

  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.json(order);
};

// =============================================================================
const createOrder = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { productIds, total } = req.body;

  if (
    !productIds ||
    !Array.isArray(productIds) ||
    !productIds.every(Number.isInteger)
  ) {
    return res.status(400).json({ message: "Invalid productIds" });
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        total: Number(total),
        products: {
          connect: productIds.map((productId) => ({
            id: Number(productId),
          })),
        },
      },
    });

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================================================================
const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { productIds, total } = req.body;

  if (productIds) {
    if (!Array.isArray(productIds) || !productIds.every(Number.isInteger)) {
      return res.status(400).json({ message: "Invalid productIds" });
    }
  }

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        products: true,
        User: true,
      },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user.userId !== existingOrder.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        total: total ? Number(total) : existingOrder.total,
        products: {
          set: productIds
            ? productIds.map((productId: number) => ({
                id: Number(productId),
              }))
            : existingOrder.products.map((product) => ({
                id: product.id,
              })),
        },
      },
    });

    return res.json(updatedOrder);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================================================================

export { getOrders, getOrder, createOrder, updateOrder };
