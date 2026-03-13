import db from "../db.server";

export const loader = async ({ request }) => {

  const id = new URL(request.url).searchParams.get("id");
  const customerId = new URL(request.url).searchParams.get("customerId");
  const task = new URL(request.url).searchParams.get("task");

  if(task === "check" && id){
    const CheckWishList = await db.wishlist.findFirst({
      where: {
        productId: id,
      },
    });

      if(CheckWishList && CheckWishList.customerIds.includes(customerId)){
        return Response.json({ message: true });
      }else{
        return Response.json({ message: false });
      }
  }
  
  return Response.json({ message: "Please Enter Valid Parameters" });
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
    
    // products
      const products = await db.products.findFirst({
          where: {
            productId,
          },
      });

    // customers
    const customers = await db.customer.findFirst({
          where: {
            id: customerId,
          },
    });

    if (!existing && request.method == "POST" && customers.id==customerId) {
      try {
        const wishlist = await db.wishlist.create({
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

      try{ 
        const UpdateCustomerDate = await db.customer.update({
          where: { id: customerId },
          data: { 
            wishlistItems : customers.wishlistItems + 1 ,
            wishlistprice : customers.wishlistprice + parseFloat(productPrice),
          },
        })
      }catch(error){
        console.error("Error updating customer wishlist data:", error);
      }
      
      return Response.json({ 
        message: "Wishlist created successfully",
      });

    } else if (existing && request.method == "POST" && customers.id==customerId) {
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

      } catch (error) {
        console.error("Error updating wishlist entry:", error);
      }

      try{ 
        const UpdateCustomerDate = await db.customer.update({
          where: { id: customerId },
          data: { 
            wishlistItems : customers.wishlistItems + 1 ,
            wishlistprice : customers.wishlistprice + parseFloat(productPrice),
          },
        })

        return Response.json({
          message: "Product added to wishlist" ,
          data: UpdateCustomerDate,
        });
      }catch(error){
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
      
      const UpdateCustomerDate = await db.customer.update({
          where: { id: customerId },
          data: { 
            wishlistItems : customers.wishlistItems - 1 ,
            wishlistprice : customers.wishlistprice - parseFloat(productPrice),
          },
        })

      return Response.json({
        message: "Product removed from wishlist",
        data: wishlisted,
        UpdateCustomerDate:UpdateCustomerDate
      });
    }
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
