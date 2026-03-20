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
