import { useRecoilState } from "recoil";
import { customerTotalCountState } from "../store/customerAtoms";

export function useCustomerCount() {
  const [countState, setCountState] = useRecoilState(customerTotalCountState);

  const fetchTotalCount = async () => {
    setCountState({ count: 0, loading: true, error: null });

    try {
      // No id param = returns totalCount
      const res = await fetch("/api/customer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "1", // ✅ skips ngrok warning page
          "bypass-tunnel-reminder": "1", // ✅ extra safety
        },
      });
      const json = await res.json();

      if (!res.ok) {
        setCountState({ count: 0, loading: false, error: "Failed to fetch count" });
        return;
      }

      setCountState({ count: json.totalCount, loading: false, error: null });

    } catch (err) {
      setCountState({ count: 0, loading: false, error: "Network error" });
    }
  };

  return {
    count: countState.count,
    loading: countState.loading,
    error: countState.error,
    fetchTotalCount,
  };
}

