import db from "../db.server";

export const loader = async ({ request }) => {
    return Response.json({ message: "Wishlist API is working" });
}

export const action = async ({ request }) => {
    const body = await request.json();

    const productCount = 1;

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

        // if product + variants exits in product table 
        const productExits = await db.products.findFirst({
            where: {
                productId
            }
        })

        /**
        Exseting Product:  {
               id: 1,
               productId: '112',
               productName: 'jamalghoto',
               productcategory: 'jamalgoto',
               productlistCount: 2,
               instock: true,
               createdAt: 2026-03-12T06:00:59.742Z,
               updatedAt: 2026-03-12T06:17:00.215Z
            }
         **/

        // if customer already exsting 
        if (existing) {
            // Ensure customerIds is treated as a plain JS array
            const customerIds = Array.isArray(existing.customerIds)
                ? existing.customerIds
                : JSON.parse(existing.customerIds ?? "[]");

            //OutPut:-  Existing customerIds: [ '14', '13' ]

            if (customerIds.includes(customerId)) {
                // Toggle OFF: remove customer from wishlist
                const updated = customerIds.filter((id) => id !== customerId);

                await db.wishlist.update({
                    where: { id: existing.id },  // use id — always safe
                    data: { customerIds: updated }
                });

                await db.products.update({
                    where: {
                        id: productExits.id
                    },
                    data: {
                        productlistCount: productExits.productlistCount - 1
                    }
            })

                return Response.json({ message: "Removed from wishlist" });
            }

            // Toggle ON: add customer to wishlist
            await db.wishlist.update({
                where: { id: existing.id },      // use id — always safe
                data: { customerIds: [...customerIds, customerId] }
            });

            // If new customer add Then Increment the productlistCount by 1
            await db.products.update({
                where: {
                    id: productExits.id
                },
                data: {
                    productlistCount: productExits.productlistCount + 1
                }
            })

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

        if (!productExits) {
            await db.products.create({
                data: {
                    productId,
                    productName,
                    productcategory,
                    productlistCount: productCount,
                    instock
                }
            })
        }

        return Response.json({ message: "Wishlist updated successfully" });

    } catch (error) {
        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
};