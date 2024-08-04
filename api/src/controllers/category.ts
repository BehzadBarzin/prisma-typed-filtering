import { Request, RequestHandler, Response } from "express";
import { prisma } from "../utils/prisma";

// =============================================================================
const getCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
};

// =============================================================================
const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid category id" });
  }

  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  return res.json(category);
};

// =============================================================================
const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json(category);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================================================================
const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { name, description } = req.body;

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name: name || existingCategory.name,
        description: description || existingCategory.description,
      },
    });

    return res.json(updatedCategory);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================================================================

export { getCategories, getCategory, createCategory, updateCategory };
