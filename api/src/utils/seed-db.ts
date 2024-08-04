import { faker } from "@faker-js/faker";
import { prisma } from "./prisma";
import { Category, Product, Tag, User } from "@prisma/client";
import bcrypt from "bcryptjs";

type TSeedFn = () => Promise<void>;

const settings = {
  password: "Abc123",
  products: [100, 200],
  tags: [10, 20],
  categories: [10, 20],
  users: [100, 200],
  orders: [300, 500],
};

export const seedDatabase: TSeedFn = async () => {
  console.log("[Initial Seed] Seeding database...");
  // ---------------------------------------------------------------------------
  // Create Users
  const hashedPassword = await bcrypt.hash(settings.password, 10);

  const usersCount: number = faker.number.int({
    min: settings.users[0],
    max: settings.users[1],
  });

  console.log(`[Initial Seed] Creating ${usersCount} users...`);

  const usersCreated: User[] = [];

  for (let i = 0; i < usersCount; i++) {
    try {
      const newUser: User = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: hashedPassword,
        },
      });

      usersCreated.push(newUser);
    } catch (error) {}
  }
  // ---------------------------------------------------------------------------
  // Create Categories
  const categoriesCount: number = faker.number.int({
    min: settings.categories[0],
    max: settings.categories[1],
  });

  console.log(`[Initial Seed] Creating ${categoriesCount} categories...`);

  const usersCategories: Category[] = [];

  for (let i = 0; i < categoriesCount; i++) {
    try {
      const newCategory = await prisma.category.create({
        data: {
          name: faker.commerce.department(),
          description: faker.commerce.productDescription(),
        },
      });

      usersCategories.push(newCategory);
    } catch (error) {}
  }

  // ---------------------------------------------------------------------------
  // Create Tags
  const tagsCount: number = faker.number.int({
    min: settings.tags[0],
    max: settings.tags[1],
  });

  console.log(`[Initial Seed] Creating ${tagsCount} tags...`);

  const createdTags: Tag[] = [];

  for (let i = 0; i < tagsCount; i++) {
    try {
      const newTag = await prisma.tag.create({
        data: {
          name: faker.commerce.productAdjective(),
        },
      });

      createdTags.push(newTag);
    } catch (error) {}
  }
  // ---------------------------------------------------------------------------
  // Create Products
  const productsCount: number = faker.number.int({
    min: settings.products[0],
    max: settings.products[1],
  });

  console.log(`[Initial Seed] Creating ${productsCount} products...`);

  const createdProducts: Product[] = [];

  for (let i = 0; i < productsCount; i++) {
    // Choose one random category from createdCategories
    const categoryIdx: number = faker.number.int({
      min: 0,
      max: usersCategories.length - 1,
    });

    // Choose a random sub-set of tags
    const tags: Tag[] = faker.helpers.arrayElements(
      createdTags,
      // Random Count
      faker.number.int({
        min: 0,
        max: createdTags.length - 1,
      })
    );

    try {
      const newProduct = await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: Number(faker.commerce.price()),
          categoryId: usersCategories[categoryIdx].id,
          tags: {
            connect: tags.map((tag) => ({
              id: tag.id,
            })),
          },
        },
      });

      createdProducts.push(newProduct);
    } catch (error) {}
  }
  // ---------------------------------------------------------------------------
  // Create Orders and Their Payments
  const ordersCount: number = faker.number.int({
    min: settings.orders[0],
    max: settings.orders[1],
  });

  console.log(`[Initial Seed] Creating ${ordersCount} orders...`);

  for (let i = 0; i < ordersCount; i++) {
    const userIdx = faker.number.int({ min: 0, max: usersCreated.length - 1 });

    // Choose a random sub-set of products
    const products: Product[] = faker.helpers.arrayElements(
      createdProducts,
      // Random Count
      faker.number.int({
        min: 1,
        max: 10,
      })
    );

    // Total Price
    const total: number = products.reduce(
      (acc, product) => acc + product.price,
      0
    );

    try {
      const newOrder = await prisma.order.create({
        data: {
          userId: usersCreated[userIdx].id,
          total: total,
          products: {
            connect: products.map((product) => ({
              id: product.id,
            })),
          },
        },
      });

      const newPayment = await prisma.payment.create({
        data: {
          orderId: newOrder.id,
          amount: newOrder.total,
        },
      });
    } catch (error) {}
  }

  // ---------------------------------------------------------------------------
  console.log("[Initial Seed] Seeding Done.");
};
