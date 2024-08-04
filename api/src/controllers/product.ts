import { Request, RequestHandler, Response } from "express";
import { prisma } from "../utils/prisma";

// =============================================================================
const getProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
};

// =============================================================================
const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json(product);
};

// =============================================================================
const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, categoryId, tagIds } = req.body;

  if (!tagIds || (!Array.isArray(tagIds) && !tagIds.every(Number.isInteger))) {
    return res.status(400).json({ message: "Invalid tagIds" });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: Number(categoryId),
        tags: {
          connect: tagIds,
        },
      },
    });

    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================================================================
const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, categoryId, tagIds } = req.body;

  if (tagIds) {
    if (!Array.isArray(tagIds) && !tagIds.every(Number.isInteger)) {
      return res.status(400).json({ message: "Invalid tagIds" });
    }
  }

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        tags: true,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: name || existingProduct.name,
        description: description || existingProduct.description,
        price: price ? parseFloat(price) : existingProduct.price,
        categoryId: categoryId
          ? Number(categoryId)
          : existingProduct.categoryId,
        tags: {
          set: tagIds || existingProduct.tags.map((tag) => tag.id),
        },
      },
    });

    return res.json(updatedProduct);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================================================================

export { getProducts, getProduct, createProduct, updateProduct };
