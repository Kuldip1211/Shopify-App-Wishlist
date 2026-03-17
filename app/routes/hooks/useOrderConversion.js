import { useRecoilState } from "recoil";
import { orderConversionState } from "../store/orderConversionState";

export function useOrderConversion() {
  const [conversionState, setConversionState] = useRecoilState(orderConversionState);
  const {
    totalWishlistedProducts,
    totalConvertedProducts,
    todayConvertedProducts,
    totalConversion,
    todayConversion,
    loading,
    error,
  } = conversionState;

  const fetchOrderConversion = async () => {
    setConversionState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await fetch("/api/order?task=conversion", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "1",
          "bypass-tunnel-reminder": "1",
        },
      });

      const result = await res.json();

      if (!res.ok) {
        setConversionState({
          totalWishlistedProducts: 0,
          totalConvertedProducts: 0,
          todayConvertedProducts: 0,
          totalConversion: 0,
          todayConversion: 0,
          loading: false,
          error: result.message || "Failed to fetch conversion",
        });
        return;
      }

      setConversionState({
        totalWishlistedProducts: result.totalWishlistedProducts || 0,
        totalConvertedProducts: result.totalConvertedProducts || 0,
        todayConvertedProducts: result.todayConvertedProducts || 0,
        totalConversion: result.totalConversion || 0,
        todayConversion: result.todayConversion || 0,
        loading: false,
        error: null,
      });
    } catch (error) {
      setConversionState({
        totalWishlistedProducts: 0,
        totalConvertedProducts: 0,
        todayConvertedProducts: 0,
        totalConversion: 0,
        todayConversion: 0,
        loading: false,
        error: "Network error",
      });
    }
  };

  return {
    totalWishlistedProducts,
    totalConvertedProducts,
    todayConvertedProducts,
    totalConversion,
    todayConversion,
    loading,
    error,
    fetchOrderConversion,
  };
}
