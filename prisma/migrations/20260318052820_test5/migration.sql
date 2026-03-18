-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DailyAnalytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "totalproduct" INTEGER NOT NULL DEFAULT 0,
    "revenue" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DailyAnalytics" ("createdAt", "date", "id", "revenue", "totalproduct", "updatedAt") SELECT "createdAt", "date", "id", "revenue", "totalproduct", "updatedAt" FROM "DailyAnalytics";
DROP TABLE "DailyAnalytics";
ALTER TABLE "new_DailyAnalytics" RENAME TO "DailyAnalytics";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
