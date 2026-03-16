import { atom } from "recoil";

export const orderConversionState = atom({
  key: "orderConversionState",
  default: {
    totalWishlistedProducts: 0,
    totalConvertedProducts: 0,
    todayConvertedProducts: 0,
    totalConversion: 0,
    todayConversion: 0,
    loading: false,
    error: null,
  },
});
