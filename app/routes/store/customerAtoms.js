import { atom } from "recoil";

// 👇 Atom to store total customer count globally
export const customerTotalCountState = atom({
  key: "customerTotalCountState",
  default: {
    count: 0,
    loading: false,
    error: null,
  },
});
