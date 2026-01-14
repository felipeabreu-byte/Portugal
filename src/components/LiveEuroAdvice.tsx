"use client";

import { useEffect, useState } from "react";
import { EuroAdviceCard } from "./EuroAdviceCard";

export function LiveEuroAdvice() {
    const [rate, setRate] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const res = await fetch("https://economia.awesomeapi.com.br/last/EUR-BRLT");
                const data = await res.json();
                if (data.EURBRLT) {
                    setRate(Number(data.EURBRLT.ask));
                }
            } catch (error) {
                console.error("Failed to fetch Euro rate:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRate();
    }, []);

    if (loading || rate === 0) {
        return null; // Or a skeleton if preferred, but user had it hidden on 0 before
    }

    return <EuroAdviceCard currentRate={rate} />;
}
