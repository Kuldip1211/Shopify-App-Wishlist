import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { todayAdminDataState } from "../store/todayAdminData";


export function useTodayAdminData() {
    const [todayAdminData, setTodayAdminData] = useRecoilState(todayAdminDataState);

    const fetchTodayAdminData = async () => {
        try {
            const res = await fetch("/api/wishlist?task=count", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "ngrok-skip-browser-warning": "1",
                            "bypass-tunnel-reminder": "1",
                        },
                    });

            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }

            const result = await res.json();

            setTodayAdminData({
                todayTotalWishlist: result.todaytotalCount ?? 0,
                todayincrementWishlist: result.todayincrementWishlist ?? 0,
                totalproducts: result.AllData?.totalCount ?? 0,
                incrementProducts: result.AllData?.totalCustomers ?? 0,
                todayTotalValue: result.todayRevenue ?? 0,
                todayTotalValueIncrement: result.todayRevenuePercentage ?? 0,
                itemPerWishlist: result.AvgperUSer ?? 0,
                WholeData: {
                    totalCustomers: result.AllData?.totalCustomers ?? 0,
                    totalCount: result.AllData?.totalCount ?? 0,
                    totalRevenue: result.AllData?.totalRevenue ?? 0,
                    OutOfStock: result.AllData?.OutOfStock ?? 0,
                },
            });

        } catch (error) {
            console.error("Error fetching today's admin data:", error);
        }
    };

    useEffect(() => {
        fetchTodayAdminData();
    }, []);

    return {
        todayAdminData,
        fetchTodayAdminData,
    }
}



