import { Request, RequestHandler, Response } from "express";
import { prisma } from "../utils/prisma";

// =============================================================================
const getTags = async (req: Request, res: Response) => {
  const tags = await prisma.tag.findMany();
  res.json(tags);
};

// =============================================================================
const getTag = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid tag id" });
  }

  const tag = await prisma.tag.findUnique({
    where: { id: Number(id) },
  });

  if (!tag) {
    return res.status(404).json({ message: "Tag not found" });
  }

  return res.json(tag);
};

// =============================================================================
const createTag = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const tag = await prisma.tag.create({
      data: {
        name,
      },
    });

    return res.status(201).json(tag);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================================================================
const updateTag = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { name } = req.body;

  try {
    const existingTag = await prisma.tag.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    const updatedTag = await prisma.tag.update({
      where: { id: Number(id) },
      data: {
        name: name || existingTag.name,
      },
    });

    return res.json(updatedTag);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================================================================

export { getTags, getTag, createTag, updateTag };
