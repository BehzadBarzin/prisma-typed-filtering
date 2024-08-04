import qs from "qs";
import {
  ModelName,
  PrismaModel,
  FindManyArgs,
  CreateArgs,
  UpdateArgs,
} from "./prisma-types";

// ====================================================================================
// Only Types that we need from the ./prisma-types file

// Type used for model names: e.g. "user", "category"
export type TModelName = ModelName;

// Type used for models from database
export type TModel<N extends TModelName> = PrismaModel<N>;

// Type used for new models
export type TCreateModel<N extends TModelName> = CreateArgs<N>;

// Type used for updating models
export type TUpdateModel<N extends TModelName> = UpdateArgs<N>;

// Type used for object passed to query
export type TQuery<N extends TModelName> = Pick<
  FindManyArgs<N>,
  "where" | "select" | "distinct" | "orderBy"
>;

// ====================================================================================
/**
 * Converts a query object to a query string.
 * Only Accepts:
 * ```
 *    const qo = {
 *      where: {...},
 *      select: {...},
 *      distinct: ...,
 *      orderBy: ...,
 *    }
 * ```
 * @param queryObject - Query object that matches the Prisma findMany arguments (see: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany)
 * @returns
 */
export function getFilterQueryString<N extends TModelName>(
  queryObject: TQuery<N>
) {
  // If queryObject contains any key that is not allowed, remove it
  const allowedKeys = ["where", "select", "distinct", "orderBy"];
  for (const key in queryObject) {
    if (!allowedKeys.includes(key)) {
      throw new Error(`Invalid query field: ${key}`);
    }
  }

  // Now let's use "qs" package to convert the object to string
  const queryString = qs.stringify(
    {
      filter: {
        ...queryObject,
      },
    },
    {
      encode: false,
      arrayFormat: "indices",
    }
  );

  return queryString;
}
