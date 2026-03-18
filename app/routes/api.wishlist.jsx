import { empty } from "@prisma/client/runtime/library";
import db from "../db.server";
import { authenticate, unauthenticated } from "../shopify.server";

export const loader = async ({ request }) => {
  const id = new URL(request.url).searchParams.get("id");
  const customerId = new URL(request.url).searchParams.get("customerId");
  const task = new URL(request.url).searchParams.get("task");

  if (task === "check" && id) {
    const CheckWishList = await db.wishlist.findFirst({
      where: {
        productId: id,
      },
    });

    if (CheckWishList && CheckWishList.customerIds.includes(customerId)) {
      return Response.json({ message: true });
    } else {
      return Response.json({ message: false });
    }
  }
  // ✅ Fetch top 4 most listed products
  if (task === "top" && !id) {
    try {
      const wishlists = await db.wishlist.findMany({
        select: {
          productId: true,
          productName: true,
          productImage: true,
          productcategory: true,
          productPrice: true,
          customerIds: true,
        },
      });

      // Build a map of productId → aggregated data
      const productMap = {};

      wishlists.forEach((item) => {
        const key = item.productId;

        if (!productMap[key]) {
          productMap[key] = {
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            productcategory: item.productcategory,
            productPrice: item.productPrice,
            totalListed: 0,
          };
        }

        // customerIds is JSON — parse safely
        const ids = Array.isArray(item.customerIds)
          ? item.customerIds
          : JSON.parse(item.customerIds || "[]");

        productMap[key].totalListed += ids.length;
      });

      // Sort by totalListed desc → take top 4
      const top4 = Object.values(productMap)
        .sort((a, b) => b.totalListed - a.totalListed)
        .slice(0, 4);

      return Response.json({ topProducts: top4 });

    } catch (error) {
      return Response.json(
        { message: "Error fetching top products" },
        { status: 500 }
      );
    }
  }

  if (task === "count" && !id) {
    // Total wishlist count (all time)
    const result = await db.products.aggregate({
      _sum: {
        productlistCount: true,
      },
    });


    // Today's wishlist count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayResult = await db.products.aggregate({
      _sum: {
        productlistCount: true,
      },
      where: {
        updatedAt: {
          gte: today,
        },
      },
    });


    // Total revenue (all time)
    const revenueResult = await db.customer.aggregate({
      _sum: {
        wishlistprice: true,
      },
    });

    // Today's revenue
    const todayRevenueResult = await db.customer.aggregate({
      _sum: {
        wishlistprice: true,
      },
      where: {
        updatedAt: {
          gte: today,
        },
      },
    });


    // Total customers count
    const totalCustomers = await db.customer.count();


    // out of stock products count
    const OOSProducts = await db.products.count({
      where: {
        instock: false,
      },
    })

    const OutOfStock = OOSProducts || 0


    // total count odf wishlist
    const totalCount = result._sum.productlistCount ?? 0;
    // today Total Count
    const todaytotalCount = todayResult._sum.productlistCount ?? 10;
    // how much today growth in percentage of wishlist count
    let rst = (todaytotalCount * 100) / totalCount
    const todayincrementWishlist = Math.round(rst * 100) / 100;
    // total revenue
    const totalRevenue = revenueResult._sum.wishlistprice ?? 0;
    //today revenue
    const todayRevenue = todayRevenueResult._sum.wishlistprice ?? 0;
    // how much today growth in percentage of revenue
    let revenueRst = (todayRevenue * 100) / totalRevenue
    const todayRevenuePercentage = Math.round(revenueRst * 100) / 100;
    //wiahliat per USER
    let AvgperUSer = totalCount / totalCustomers || 0;



    const AllData = {
      totalCustomers,
      totalCount,
      totalRevenue,
      OutOfStock
    }

    return Response.json({
      totalCount,
      todaytotalCount,
      todayincrementWishlist,
      todayRevenue,
      todayRevenuePercentage,
      AvgperUSer,
      AllData
    });
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

    const today = new Date().getDate();


    const start = new Date();
    start.setDate(start.getDate() + 1);

    const day = String(start.getDate()).padStart(2, '0');
    const month = String(start.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const year = String(start.getFullYear()).slice(-2); // last 2 digits

    const formattedDate = `${day}-${month}-${year}`;



    const exitsDailyAnalytics = await db.dailyAnalytics.findFirst({
      where: {
        date: formattedDate
      }
    })


    if (!existing && request.method == "POST" && customers.id == customerId) {
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

      try {
        const UpdateCustomerDate = await db.customer.update({
          where: { id: customerId },
          data: {
            wishlistItems: customers.wishlistItems + 1,
            wishlistprice: customers.wishlistprice + parseFloat(productPrice),
          },
        })
      } catch (error) {
        console.error("Error updating customer wishlist data:", error);
      }

      if (exitsDailyAnalytics) {
        console.log("IT is not null")
        console.log("exitsDailyAnalytics:--------------------", exitsDailyAnalytics);
        const updateDailyAnalytics = await db.dailyAnalytics.update({
          where: {
            id: exitsDailyAnalytics.id,
          },
          data: {
            totalproduct: exitsDailyAnalytics.totalproduct + 1,
            revenue: exitsDailyAnalytics.revenue + parseFloat(productPrice),
          }
        })
      } else {
        console.log("It is null")
        await db.dailyAnalytics.create({
          data: {
            date: formattedDate, // ✅ use Date object (not formatted string)
            totalproduct: 1,
            revenue: parseFloat(productPrice),
          },
        });
      }

      return Response.json({
        message: "Wishlist created successfully",
      });

    } else if (existing && request.method == "POST" && customers.id == customerId) {
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

      try {
        const UpdateCustomerDate = await db.customer.update({
          where: { id: customerId },
          data: {
            wishlistItems: customers.wishlistItems + 1,
            wishlistprice: customers.wishlistprice + parseFloat(productPrice),
          },
        })

      } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
      }

      if (exitsDailyAnalytics) {
        const updateDailyAnalytics = await db.dailyAnalytics.update({
          where: {
            id: exitsDailyAnalytics.id,
          },
          data: {
            totalproduct: exitsDailyAnalytics.totalproduct + 1,
            revenue: exitsDailyAnalytics.revenue + parseFloat(productPrice),
          }
        })
      } else {
        console.log("It is null")
        await db.dailyAnalytics.create({
          data: {
            date: formattedDate, // ✅ use Date object (not formatted string)
            totalproduct: 1,
            revenue: parseFloat(productPrice),
          },
        });
      }

      return Response.json({ message: "Product added to wishlist", });

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
          wishlistItems: customers.wishlistItems - 1,
          wishlistprice: customers.wishlistprice - parseFloat(productPrice),
        },
      })

      if (exitsDailyAnalytics) {
        const updateDailyAnalytics = await db.dailyAnalytics.update({
          where: {
            id: exitsDailyAnalytics.id,
          },
          data: {
            totalproduct: exitsDailyAnalytics.totalproduct - 1,
            revenue: exitsDailyAnalytics.revenue - parseFloat(productPrice),
          }
        })
      }
      return Response.json({
        message: "Product removed from wishlist",
        data: wishlisted,
        UpdateCustomerDate: UpdateCustomerDate
      });
    }
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
