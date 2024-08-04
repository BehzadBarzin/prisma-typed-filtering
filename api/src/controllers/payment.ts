import { Request, RequestHandler, Response } from "express";
import { prisma } from "../utils/prisma";

// =============================================================================
const getPayments = async (req: Request, res: Response) => {
  const payments = await prisma.payment.findMany();
  res.json(payments);
};

// =============================================================================
const getPayment = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid payment id" });
  }

  const payment = await prisma.payment.findUnique({
    where: { id: Number(id) },
  });

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  return res.json(payment);
};

// =============================================================================
const createPayment = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { amount, orderId } = req.body;

  if (!amount || isNaN(Number(amount))) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  if (!orderId || isNaN(Number(orderId))) {
    return res.status(400).json({ message: "Invalid order id" });
  }

  try {
    const payment = await prisma.payment.create({
      data: {
        amount: Number(amount),
        orderId: Number(orderId),
      },
    });

    return res.status(201).json(payment);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================================================================
const updatePayment = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { amount, orderId } = req.body;

  if (amount) {
    if (isNaN(Number(amount))) {
      return res.status(400).json({ message: "Invalid amount" });
    }
  }

  if (orderId) {
    if (isNaN(Number(orderId))) {
      return res.status(400).json({ message: "Invalid order id" });
    }
  }

  try {
    const existingPayment = await prisma.payment.findUnique({
      where: { id: Number(id) },
      include: { Order: true },
    });

    if (!existingPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (req.user.userId !== existingPayment.Order.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: Number(id) },
      data: {
        amount: amount || existingPayment.amount,
        orderId: orderId || existingPayment.orderId,
      },
    });

    return res.json(updatedPayment);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================================================================

export { getPayments, getPayment, createPayment, updatePayment };
