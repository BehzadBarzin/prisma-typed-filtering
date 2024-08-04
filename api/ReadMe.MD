# Express Server with Prisma to Implement Query String Filtering

This is a simple express server with Prisma, and is created to show how to implement query string filtering.

## Technologies

- Express
- TypeScript
- Prisma

## How to use

1. Install dependencies:

```bash
pnpm install
```

2. Add required env variables (`.env.dev` and `.env.prod`). Use `.env-example` as a reference.

3. Start the development server:

```bash
pnpm dev
```

4. Or build and start the production server:

- Make sure to run Prisma migration for production database.

```bash
pnpm build
pnpm start
```
