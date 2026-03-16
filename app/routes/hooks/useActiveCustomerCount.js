import { useRecoilState } from "recoil";
import { activeCustomerCountState } from "../store/activeCustomerCountState"; // ✅ fixed path

export function useActiveCustomerCount() {
  const [countState, setCountState] = useRecoilState(activeCustomerCountState);

  const fetchTotalCount = async () => {
    setCountState({ count: 0, loading: true, error: null });

    try {
      const res = await fetch("/api/customer?active=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "1",
          "bypass-tunnel-reminder": "1",
        },
      });
      const result = await res.json();

      if (!res.ok) {
        setCountState({ count: 0, loading: false, error: "Failed to fetch count" });
        return;
      }

      setCountState({ count: result.totalCount, loading: false, error: null });

    } catch (err) {
      setCountState({ count: 0, loading: false, error: "Network error" });
    }
  }; // ✅ fetchTotalCount properly closed

  // ✅ return is correctly outside fetchTotalCount
  return {
    activeCount: countState.count,
    activeloading: countState.loading,
    activeerror: countState.error,
    fetchTotalCount,
  };
}