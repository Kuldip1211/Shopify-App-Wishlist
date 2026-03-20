import { atom } from "recoil";

export const todayAdminDataState = atom({
    key: "todayAdminDataState",
    default: {
        todayTotalWishlist              : 0,
        todayincrementWishlist          : 0,
        totalproducts                   : 0,
        incrementProducts               : 0,
        todayTotalValue                 : 0,
        todayTotalValueIncrement        : 0,
        itemPerWishlist                 : 0,
    }
})









//   const kpiCards = [
//     { label: "Total Wishlists", value: users.length,                          sub: "↑ 12% this week",  icon: "❤️", color: "#E63946", delay: "0s"    },
//     { label: "Items Saved",     value: totalItems,                             sub: "↑ 8% this week",   icon: "🛍️", color: "#4ECDC4", delay: "0.08s" },
//     { label: "Total Value",     value: `$${totalValue.toLocaleString()}`,      sub: "↑ 24% this month", icon: "💰", color: "#F4A261", delay: "0.16s" },
//     { label: "Avg per User",    value: Math.round(totalItems / users.length),  sub: "items per wishlist",icon: "📊", color: "#BB8FCE", delay: "0.24s" },
//   ];