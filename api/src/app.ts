import express, { Express, Request, Response, json } from "express";

// Make sure to import the env file first
import "./utils/env";

import { authRouter } from "./routes/auth";
import { seedDatabase } from "./utils/seed-db";
import { productRouter } from "./routes/product";
import { categoryRouter } from "./routes/category";
import { tagRouter } from "./routes/tag";
import { orderRouter } from "./routes/order";
import { paymentRouter } from "./routes/payment";
import { prisma } from "./utils/prisma";
import { Prisma } from "@prisma/client";
import { getQueryFilter } from "./utils/query-filter";

export async function createServer() {
  const app: Express = express();

  // Serve static files
  app.use(express.static("public"));

  // Parse JSON request bodies
  app.use(json());

  app.get("/", (req: Request, res: Response) => {
    res.json({ data: "Hello World!" });
  });

  app.get("/test", async (req: Request, res: Response) => {
    const filter = getQueryFilter(req.query) as any;

    // console.clear();
    // console.log(filter);
    // console.log(typeof filter["select"]["id"]);

    try {
      const orders = await prisma.order.findMany({
        ...filter,
      });

      return res.send(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  });

  app.post("/seed-db", async (req: Request, res: Response) => {
    // Start seeding in the background
    seedDatabase()
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });

    return res.send({
      message: `Seeding database  started in the background.`,
    });
  });

  // Application Routers
  app.use("/auth", authRouter);
  app.use("/products", productRouter);
  app.use("/categories", categoryRouter);
  app.use("/tags", tagRouter);
  app.use("/orders", orderRouter);
  app.use("/payments", paymentRouter);

  return app;
}
