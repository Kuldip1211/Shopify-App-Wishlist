/*
  Warnings:

  - Added the required column `updatedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "wishlistItems" INTEGER NOT NULL,
    "wishlistprice" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Customer" ("email", "firstName", "id", "lastName", "wishlistItems", "wishlistprice") SELECT "email", "firstName", "id", "lastName", "wishlistItems", "wishlistprice" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_id_key" ON "Customer"("id");
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
