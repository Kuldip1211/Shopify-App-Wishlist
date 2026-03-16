import { useEffect } from "react";
import { useMostListedProducts } from "../hooks/mostlistedproduct";

export function MostListProduct() {
    const { fetchMostListedProducts } = useMostListedProducts();

    useEffect(() => {
        fetchMostListedProducts();
    }, [])

    return null;
}1