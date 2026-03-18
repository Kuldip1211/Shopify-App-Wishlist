import { authenticate } from "../shopify.server";
import db from "../db.server";
import { data } from "react-router";

export const action = async ({ request }) => {
  const { payload, shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  if (payload) {
    const productId = payload.id.toString();

    try {
        console.log(`Received product deletion webhook for product ID: ${productId}`);
        console.log("draft will call");
    // Delete product from Products model
      
    const deletedProduct = await db.products.deleteMany({
        where: {
            productId: productId,
        },
    });

    if(!deletedProduct){
        console.log(`No product in wishlist`);
        return new Response();
    }

    const customerIds = await db.wishlist.findMany({
        select : {
            customerIds: true,
            productPrice: true,
        },
        where: {
          productId: productId,
        },
    })

    const deleteWishlistEntries = await db.wishlist.deleteMany({
        where: {
          productId: productId,
        },
    })

    for (const entry of customerIds) {
        if(entry.customerIds.length > 0){
            for (const customerId of entry.customerIds) {
                const updateCustomer = await db.customer.updateMany({
                    where: {
                        id: customerId,  // single unique value
                    },
                    data: {
                        wishlistItems: {
                            decrement: 1,
                        },
                        wishlistprice: {
                            decrement: (parseFloat(entry.productPrice)),
                        },
                    },
                });
                console .log(updateCustomer);
            }
        }
    }

    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
    }
  }

  return new Response();
};
