// ✅ moved from app/routes/ to app/components/
import { useEffect } from "react";
import { useActiveCustomerCount } from "../routes/hooks/useActiveCustomerCount"; // ✅ fixed path

export function ActiveCustomerCountLoader() {
  const { fetchTotalCount } = useActiveCustomerCount();

  useEffect(() => {
    fetchTotalCount();
  }, []);

  return null;
}