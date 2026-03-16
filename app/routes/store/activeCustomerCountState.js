import { atom } from "recoil";

export const activeCustomerCountState = atom({
  key: "activeCustomerCountState",
  default: {
    count: 0,       // ✅ matches countState.count in hook
    loading: false, // ✅ matches countState.loading
    error: null,    // ✅ matches countState.error
  },
});