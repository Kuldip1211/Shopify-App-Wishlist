import { useRecoilState } from "recoil";
import { MostListedProducts } from "../store/toplistproduct";

export function useMostListedProducts() {
    const [mostListedProducts, setMostListedProducts] = useRecoilState(MostListedProducts);

    const fetchMostListedProducts = async () => {
        try {
            const res = await fetch("api/wishlist?task=top", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "1",
                    "bypass-tunnel-reminder": "1",
                },
            })

            const result = await res.json();
            
            if (!res.ok) {
                setMostListedProducts([]);
                return;
            }

            setMostListedProducts(result.topProducts || []);
        } catch (error) {
            console.error("Error fetching most listed products:", error);
            setMostListedProducts([]);
        }
    }
    return {
        mostListedProducts,
        fetchMostListedProducts,
    }
}