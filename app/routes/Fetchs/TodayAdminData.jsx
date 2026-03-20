import { useTodayAdminData } from "../hooks/todayAdminDataState";
import { useEffect } from "react";

export function TodayAdminDataLoader() {
    const { fetchTodayAdminData } = useTodayAdminData();

    useEffect(() => {
        fetchTodayAdminData();
    }, []);
    
    return null;
}