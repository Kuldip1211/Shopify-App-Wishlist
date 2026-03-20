-- CreateTable
CREATE TABLE "RemoveWishlistData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dailyAnalytics_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
