// ✅ moved from app/routes/ to app/components/
import { useEffect } from "react";
import { useCustomerList } from "../hooks/customerListState"; // ✅ fixed path

export function CustomerListLoader() {
  const { fetchCustomerList } = useCustomerList();

  useEffect(() => {
    fetchCustomerList();
  }, []);

  return null;
}