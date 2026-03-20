/*
  Warnings:

  - Added the required column `variantId` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productcategory" TEXT NOT NULL,
    "productlistCount" INTEGER NOT NULL,
    "instock" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Products" ("createdAt", "id", "instock", "productId", "productName", "productcategory", "productlistCount", "updatedAt") SELECT "createdAt", "id", "instock", "productId", "productName", "productcategory", "productlistCount", "updatedAt" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;




-- ============================================================
-- ONE ROW PER TABLE - Real Data - Date: March 19, 2026
-- ============================================================

-- -- 1. Customer
-- INSERT INTO "Customer" ("id", "firstName", "lastName", "email", "wishlistItems", "wishlistprice", "updatedAt") VALUES
-- ('8910902591747', 'Kuldeep', 'Radixweb', 'kuldeep.chudasama@radixweb.com', 1, 69.99, '2026-03-19T10:31:07.000Z');

-- -- 2. Wishlist
-- INSERT INTO "Wishlist" ("id", "customerIds", "productId", "varientId", "productName", "productPrice", "productcategory", "productImage", "productLink", "instock", "createdAt", "updatedAt") VALUES
-- (1, '["8910902591747"]', '9338497892611', '47852315541763', 'Anchor Bracelet Mens', '69.99', 'Bracelet', 'https://sigmasoundtest.myshopify.com/cdn/shop/files/anchor-bracelet-mens_925x_9aceb48d-9b02-4e37-b5eb-7f000e7a0d46.jpg', 'https://sigmasoundtest.myshopify.com/products/leather-anchor', true, '2026-03-19T10:31:07.000Z', '2026-03-19T10:31:07.000Z');

-- -- 3. Products
-- INSERT INTO "Products" ("id", "productId", "variantId", "productName", "productcategory", "productlistCount", "instock", "createdAt", "updatedAt") VALUES
-- (1, '9338497892611', '47852315541763', 'Anchor Bracelet Mens', 'Bracelet', 1, true, '2026-03-19T10:31:07.000Z', '2026-03-19T10:31:07.000Z');

-- -- 4. DailyAnalytics
-- INSERT INTO "DailyAnalytics" ("id", "date", "totalproduct", "revenue", "createdAt", "updatedAt") VALUES
-- (1, '2026-03-19', 1, 69.99, '2026-03-19T23:59:00.000Z', '2026-03-19T23:59:00.000Z');

-- -- 5. RemoveWishlistData
-- INSERT INTO "RemoveWishlistData" ("id", "dailyAnalytics_id", "product_id", "variant_id", "user_id", "createdAt", "updatedAt") VALUES
-- (1, 1, '9338497892611', '47852315541763', '8910902591747', '2026-03-19T10:31:07.000Z', '2026-03-19T10:31:07.000Z');