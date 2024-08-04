import {
  getFilterQueryString,
  TCreateModel,
  TModel,
  TUpdateModel,
} from "./query-filter";

async function main() {
  const user: TModel<"User"> = {
    id: 10,
    email: "email@email.com",
    password: "password",
  };

  const newUser: TCreateModel<"User"> = {
    email: "email@email.com",
    password: "password",
  };

  const updateUser: TUpdateModel<"User"> = {
    email: "email2@email.com",
  };

  // -----------------------------------------------------------------------------------

  const query: string = getFilterQueryString<"Order">({
    select: {
      id: true,
      total: true,
      products: {
        select: {
          name: true,
        },
      },
      User: {
        select: {
          email: true,
        },
      },
    },
    where: {
      products: {
        every: {
          name: {
            contains: "x",
          },
        },
      },
    },
    orderBy: {
      total: "desc",
    },
  });

  console.clear();
  console.log("Query:", query);
  console.log("-".repeat(10));
  console.log("Making Request!");
  console.log("-".repeat(10));

  try {
    const response = await fetch(`http://localhost:3000/test?${query}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("🔴:", error);
  }
}

main();
