import db from "../db.server";

export const loader = async () => {
    return Response.json({ message: "Wishlist API is working" });
}

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
        instock
    } = body;

    try {
        // Use findFirst instead of findUnique — no @@unique constraint needed
        const existing = await db.wishlist.findFirst({
            where: {
                productId,
                varientId
            }
        });

        if (existing) {
            // Ensure customerIds is treated as a plain JS array
            const customerIds = Array.isArray(existing.customerIds)
                ? existing.customerIds
                : JSON.parse(existing.customerIds ?? "[]");

            if (customerIds.includes(customerId)) {
                // Toggle OFF: remove customer from wishlist
                const updated = customerIds.filter((id) => id !== customerId);

                await db.wishlist.update({
                    where: { id: existing.id },  // use id — always safe
                    data: { customerIds: updated }
                });

                return Response.json({ message: "Removed from wishlist" });
            }

            // Toggle ON: add customer to wishlist
            await db.wishlist.update({
                where: { id: existing.id },      // use id — always safe
                data: { customerIds: [...customerIds, customerId] }
            });

        } else {
            // Create new wishlist row with this customer
            await db.wishlist.create({
                data: {
                    productId,
                    varientId,
                    productName,
                    productPrice,
                    productcategory,
                    productImage,
                    productLink,
                    instock,
                    customerIds: [customerId]
                }
            });
        }

        return Response.json({ message: "Wishlist updated successfully" });

    } catch (error) {
        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
};
