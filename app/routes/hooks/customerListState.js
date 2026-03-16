import { useRecoilState } from "recoil";
import { customerListState } from "../store/recentwishlist";

// 👇 Helper to format "lastActive" from updatedAt
function getLastActive(updatedAt) {
    const now = new Date();
    const updated = new Date(updatedAt);
    const diffMs = now - updated;

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

// 👇 Avatar colors pool
const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F7DC6F", "#BB8FCE", "#F0A500", "#6BCB77"];

// 👇 Transform raw API customer → your desired shape
function transformCustomer(customer, index) {
    const firstName = customer.firstName || "";
    const lastName = customer.lastName || "";

    return {
        user: `${firstName} ${lastName}`.trim(),
        email: customer.email,
        products: customer.wishlistItems,
        wishlistprice: customer.wishlistprice,
        avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
        lastActive: getLastActive(customer.updatedAt),
        color: COLORS[index % COLORS.length], // cycles through colors
        id: customer.id,
    };
}

export function useCustomerList() {
    const [recentWishlists, setrecentWishlists] = useRecoilState(customerListState);

    const fetchCustomerList = async () => {
        setrecentWishlists({ customers: [], loading: true, error: null });

        try {
            const res = await fetch("/api/customer?active=all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "1",
                    "bypass-tunnel-reminder": "1",
                },
            });

            const result = await res.json();

            if (!res.ok) {
                setrecentWishlists({ customers: [], loading: false, error: "Failed to fetch customers" });
                return;
            }

            // ✅ Transform each customer to your desired shape
            const transformed = (result.customers || []).map((c, i) => transformCustomer(c, i));
            setrecentWishlists({ customers: transformed, loading: false, error: null });

        } catch (err) {
            setrecentWishlists({ customers: [], loading: false, error: err.message });
        }
    };

    return {
        recentWishlists,
        fetchCustomerList,
    };
}