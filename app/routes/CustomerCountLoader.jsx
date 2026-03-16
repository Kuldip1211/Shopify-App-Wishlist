// This runs ONCE when app loads, seeds Recoil globally
import { useEffect } from "react";
import { useCustomerCount } from "./hooks/useCustomerCount";

export function CustomerCountLoader() {
  const { fetchTotalCount } = useCustomerCount();

  useEffect(() => {
    fetchTotalCount(); // 👈 fetch once on app mount
  }, []);

  return null; // renders nothing, just loads data
}