import { useEffect } from "react";
import { useOrderConversion } from "../hooks/useOrderConversion";

export function OrderConversionLoader() {
  const { fetchOrderConversion } = useOrderConversion();

  useEffect(() => {
    fetchOrderConversion();
  }, []);

  return null;
}
