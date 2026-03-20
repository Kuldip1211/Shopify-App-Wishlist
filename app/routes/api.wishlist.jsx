import { empty } from "@prisma/client/runtime/library";
import db from "../db.server";
import { authenticate, unauthenticated } from "../shopify.server";
import { data } from "react-router";

// ----------------------------------------------------------------------------------------------------------------------------------------------------
//                                                            GET - Check wishlist status / Get top 4 most wishlisted products / Get wishlist analytics
// ---------------------------------------------------------------------------------------------------------------------------------------------------- 
export const loader = async ({ request }) => {
  // this is productid
  const id = new URL(request.url).searchParams.get("id");

  // this is variant id 
  const varientId = new URL(request.url).searchParams.get("varientId");

  const customerId = new URL(request.url).searchParams.get("customerId");
  const task = new URL(request.url).searchParams.get("task");

  if (task === "check" && id) {
    console.log("Checking wishlist status for productId:", id, "variantId:", varientId, "customerId:", customerId);
    const CheckWishList = await db.wishlist.findFirst({
      where: {
        productId: id,
        varientId: varientId,
      },
    });

    const DailyanalistID = await db.removeWishlistData.findFirst({
      where: {
        product_id: id,
        variant_id: varientId,
        user_id: customerId,
      },
      select: {
        dailyAnalytics_id: true,
      }
    })

    if (CheckWishList && CheckWishList.customerIds.includes(customerId)) {
      return Response.json({ message: true, DailyAnalyticsId: DailyanalistID?.dailyAnalytics_id ?? "0" });
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


    //get data from daily analytics table for today date
    // start = 6 days ago (including today = total 7 days)
    const start2 = new Date();
    // start.setDate(start.getDate() - 1);

    const day2 = String(start2.getDate()).padStart(2, '0');
    const month2 = String(start2.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const year2 = String(start2.getFullYear()).slice(-2); // last 2 digits

    const formattedDate2 = `${day2}-${month2}-${year2}`;
    console.log("Today's date (formatted):", formattedDate2);

    // fetch records directly using createdAt
    const records = await db.dailyAnalytics.findMany({
      where: {
        date: formattedDate2
      },
    });

    const TodatPRoduct = records[0]?.totalproduct ?? 0;

    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("Daily Analytics records for today:", records);
    console.log("TodatPRoduct:", TodatPRoduct);
    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("------------------------------------------------------------------------------------------------------------------");


    // ✅ Calculate date range: 6 days ago → today
    const today2 = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const records2 = await db.dailyAnalytics.findMany({
      where: {
        createdAt: {
          gte: new Date(sevenDaysAgo.setHours(0, 0, 0, 0)),   // ✅ actual Date object
          lte: new Date(today.setHours(23, 59, 59, 999)),      // ✅ actual Date object
        },
      },
    });

    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("Daily Analytics records for last 7 days:", records2);
    console.log("------------------------------------------------------------------------------------------------------------------");

    // prepare last 7 days map
    const daysMap = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today2.getDate() - i);

      const key = d.toISOString().split("T")[0]; // YYYY-MM-DD
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

      daysMap[key] = {
        day: dayName,
        totalproduct: 0,
        revenue: 0
      };
    }

    // fill actual data
    records2.forEach(r => {
      const key = new Date(r.createdAt).toISOString().split("T")[0];

      if (daysMap[key]) {
        daysMap[key].totalproduct += r.totalproduct;
        daysMap[key].revenue += r.revenue;
      }
    });

    const DailyAnalistresult = Object.values(daysMap);

    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("                                                     Daily Analytics Data                                         ");
    console.log("------------------------------------------------------------------------------------------------------------------")
    console.log("📊 Final Weekly Data:", DailyAnalistresult);


    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("                                                 OOS Products Count                                         ");
    console.log("------------------------------------------------------------------------------------------------------------------")

    let oosOnly2 = [];

    try {
      const products = await db.products.findMany({
        where: {
          productlistCount: {
            not: 0   // ✅ only fetch where != 0
          }
        },
        select: {
          productcategory: true,
          instock: true,
          productlistCount: true
        }
      });

      const categoryMap = {};

      products.forEach((product) => {
        const category = product.productcategory.toLowerCase();

        if (!categoryMap[category]) {
          categoryMap[category] = {
            category,
            outOfStock: 0,
            total: 0
          };
        }

        categoryMap[category].total += 1;

        if (!product.instock) {
          categoryMap[category].outOfStock += 1;
        }
      });

      oosOnly2 = Object.values(categoryMap);

    } catch (error) {
      console.error(error);
    }


    console.log(oosOnly2);

    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("                                                 Total Wishlist Count                                         ");
    console.log("------------------------------------------------------------------------------------------------------------------")

    const now = new Date();

    const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const rows = await db.dailyAnalytics.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        createdAt: true,
        totalproduct: true,
      },
    });

    const monthKeys = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthKeys.push(key);
    }

    const monthMap = {};
    for (const key of monthKeys) {
      monthMap[key] = 0;
    }

    for (const row of rows) {
      const d = new Date(row.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthMap[key] !== undefined) {
        monthMap[key] += row.totalproduct;
      }
    }

    // Current month total
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const currentMonthWishlists = monthMap[currentMonthKey] ?? 0;

    const barData = monthKeys.map((key) => {
      const [year, month] = key.split("-");
      const label = new Date(Number(year), Number(month) - 1, 1)
        .toLocaleString("en-US", { month: "short" });
      return { month: label, wishlists: monthMap[key] };
    });

    console.log("------------------------------------------------------------------------------------------------------------------");
    console.log("                                                 Monthly Wishlist Count                                         ");
    console.log("------------------------------------------------------------------------------------------------------------------")
    console.log(barData);



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


    const start = new Date();
    // start.setDate(start.getDate() + 1);
    const day = String(start.getDate()).padStart(2, '0');
    const month = String(start.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const year = String(start.getFullYear()).slice(-2); // last 2 digits

    const formattedDate = `${day}-${month}-${year}`;

    console.log("?????????///////%%%%%%%%%%%%$4444444444444444443333333#############3");
    console.log("Today's date (formatted):", formattedDate);

    // Today's revenue
    const todayRevenueResult = await db.dailyAnalytics.findFirst({
      where: {
        date: formattedDate
      },
      select: {
        revenue: true,
      }
    });

    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log(todayRevenueResult);

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
    const todaytotalCount = TodatPRoduct;
    // how much today growth in percentage of wishlist count
    let rst = (todaytotalCount * 100) / totalCount
    const todayincrementWishlist = Math.round(rst * 100) / 100;
    // total revenue
    const totalRevenue = (revenueResult._sum.wishlistprice ?? 0).toFixed(2);
    //today revenue
    const todayRevenue = (todayRevenueResult?.revenue ?? 0).toFixed(2);
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
      AllData,
      DailyAnalistresult,
      oosOnly2,
      barData,
      currentMonthWishlists
    });
  }

  return Response.json({ message: "Please Enter Valid Parameters" });
};


// ----------------------------------------------------------------------------------------------------------------------------------------------------
//                                                            POST - Add to wishlist / DELETE - Remove from wishlist
// ----------------------------------------------------------------------------------------------------------------------------------------------------
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
    DailyAnalyticsId,
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


    const start = new Date();
    // start.setDate(start.getDate() - 2);

    const day = String(start.getDate()).padStart(2, '0');
    const month = String(start.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const year = String(start.getFullYear()).slice(-2); // last 2 digits

    const formattedDate = `${day}-${month}-${year}`;
    console.log("Today's date (formatted):", formattedDate);


    const exitsDailyAnalytics = await db.dailyAnalytics.findFirst({
      where: {
        date: formattedDate,
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
            variantId: varientId,
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

        try {
          const removeWishlistData = await db.removeWishlistData.create({
            data: {
              dailyAnalytics_id: updateDailyAnalytics.id,
              product_id: productId,
              variant_id: varientId,
              user_id: customerId,
            }
          })
        } catch (error) {
          console.error("Error creating removeWishlistData entry:", error);
        }

        return Response.json({
          message: "Wishlist created successfully",
          id: updateDailyAnalytics.id
        });
      } else {
        console.log("It is null")
        const DailyAnalystics = await db.dailyAnalytics.create({
          data: {
            date: formattedDate, // ✅ use Date object (not formatted string)
            totalproduct: 1,
            revenue: parseFloat(productPrice),
          },
        });

        try {
          console.log("DailyAnalystics:--------------------");
          const removeWishlistData = await db.removeWishlistData.create({
            data: {
              dailyAnalytics_id: DailyAnalystics.id,
              product_id: productId,
              variant_id: varientId,
              user_id: customerId,
            }
          })
        } catch (error) {
          console.error("Error creating removeWishlistData entry:", error);
        }

        return Response.json({
          message: "Wishlist created successfully",
          id: DailyAnalystics.id
        });
      }
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
          where: { id: products.id, variantId: varientId },
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

        try {
          const removeWishlistData = await db.removeWishlistData.create({
            data: {
              dailyAnalytics_id: updateDailyAnalytics.id,
              product_id: productId,
              variant_id: varientId,
              user_id: customerId,
            }
          })
          
          return Response.json({ message: "Product added to wishlist", id: updateDailyAnalytics.id });

        } catch (error) {
          console.error("Error creating removeWishlistData entry:", error);
          return Response.json({ message: "Product can not beadded to wishlist" ,  error : error });
        }
      } else {
        console.log("It is null")
        const DailyAnalystics = await db.dailyAnalytics.create({
          data: {
            date: formattedDate, // ✅ use Date object (not formatted string)
            totalproduct: 1,
            revenue: parseFloat(productPrice),
          },
        });

        try {
          const removeWishlistData = await db.removeWishlistData.create({
            data: {
              dailyAnalytics_id: DailyAnalystics.id,
              product_id: productId,
              variant_id: varientId,
              user_id: customerId,
            }
          })

          return Response.json({ message: "Product added to wishlist", id: updateDailyAnalytics.id });

        } catch (error) {
          console.error("Error creating removeWishlistData entry:", error);
          return Response.json({ message: "Product can not beadded to wishlist" ,  error : error });
        }

      }

    } else if (existing && request.method == "DELETE") {

      const UserIds = existing.customerIds;

      if (!UserIds.includes(customerId)) {
        return Response.json({
          message: "Customer has not wishlisted this product",
        });
      }

      console.log("------------------------((((())))) ");

      const wishlisted = await db.wishlist.update({
        where: { id: existing.id }, // use id — always safe
        data: { customerIds: UserIds.filter((id) => id !== customerId) },
      });

      const UpdateProduct = await db.products.update({
        where: { id: products.id, variantId: varientId },
        data: { productlistCount: products.productlistCount - 1 },
      });

      const UpdateCustomerDate = await db.customer.update({
        where: { id: customerId },
        data: {
          wishlistItems: customers.wishlistItems - 1,
          wishlistprice: customers.wishlistprice - parseFloat(productPrice),
        },
      })

      // const Dstart = new Date();
      // Dstart.setHours(0, 0, 0, 0);

      // const end = new Date();
      // end.setHours(23, 59, 59, 999);

      try {


        if (DailyAnalyticsId) {
          console.log("DailyAnalyticsId:--------------------", DailyAnalyticsId);
          console.log("formattedDate:--------------------", formattedDate);

          const updatedAnalytics = await db.dailyAnalytics.findFirst({
            where: {
              id: parseInt(DailyAnalyticsId),
              date: formattedDate,
            }
          })

          if (updatedAnalytics) {
            console.log("updatedAnalytics:--------------------", updatedAnalytics);

            const removedAnalytics = await db.dailyAnalytics.update({
              where: {
                id: parseInt(DailyAnalyticsId),
                date: formattedDate,
              },
              data: {
                totalproduct: updatedAnalytics.totalproduct - 1,
                revenue: parseFloat((updatedAnalytics.revenue - parseFloat(productPrice)).toFixed(2)),
              }
            })

            console.log("removedAnalytics:--------------------", removedAnalytics);
          }
        }
      } catch (error) {
        console.log("Error updating daily analytics:", error);
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
