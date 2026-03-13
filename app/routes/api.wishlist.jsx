import db from "../db.server";

export const loader = async ({ request }) => {
  return Response.json({ message: "Wishlist API is working" });
};

export const action = async ({ request }) => {
  const body = await request.json();

  const {
    customerId,
    productId,
    varientId,
    productName,
    productPrice,
    productcategory,
    productImage,
    productLink,
    instock,
  } = body;

  try {
    // Use findFirst instead of findUnique — no @@unique constraint needed
    const existing = await db.wishlist.findFirst({
      where: {
        productId,
        varientId,
      },
    });

    const products = await db.products.findFirst({
      where: {
        productId,
      },
    });

    if (!existing && request.method == "POST") {
      try {
        const customer = await db.wishlist.create({
          data: {
            productId,
            varientId,
            productName,
            productPrice,
            productcategory,
            productImage,
            productLink,
            instock,
            customerIds: [customerId],
          },
        });
      } catch (error) {
        console.error("Error creating wihslist entry:", error);
      }

      try {
        const productEntry = await db.products.create({
          data: {
            productId,
            productName,
            productcategory,
            productlistCount: 1,
            instock, // Initialize with 1 since it's being wishlisted now
          },
        });
      } catch (error) {
        console.error("Error creating product entry:", error);
      }

      return Response.json({ message: "Wishlist created successfully" });
    } else if (existing && request.method == "POST") {
      const UserIDs = existing.customerIds;

      if (UserIDs.includes(customerId)) {
        return Response.json({
          message: "Customer already wishlisted this product",
        });
      }

      try {
        const wishlisted = await db.wishlist.update({
          where: { id: existing.id }, // use id — always safe
          data: { customerIds: [...UserIDs, customerId] },
        });

        const UpdateProduct = await db.products.update({
          where: { id: products.id },
          data: { productlistCount: products.productlistCount + 1 },
        });

        return Response.json({
          message: "Product added to wishlist",
          data: wishlisted,
        });
      } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
      }
    } else if (existing && request.method == "DELETE") {
      const UserIds = existing.customerIds;

      if (!UserIds.includes(customerId)) {
        return Response.json({
          message: "Customer has not wishlisted this product",
        });
      }

      const wishlisted = await db.wishlist.update({
        where: { id: existing.id }, // use id — always safe
        data: { customerIds: UserIds.filter((id) => id !== customerId) },
      });

      const UpdateProduct = await db.products.update({
        where: { id: products.id },
        data: { productlistCount: products.productlistCount - 1 },
      });

      return Response.json({
        message: "Product removed from wishlist",
        data: wishlisted,
      });
    }
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
