"use client";

import { useEffect, useState } from "react";
import { EuroAdviceCard } from "./EuroAdviceCard";

export function LiveEuroAdvice() {
    const [rate, setRate] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                // Fetch from our own API route
                console.log("Fetching /api/exchange-rate...");
                const res = await fetch("/api/exchange-rate");

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`Status: ${res.status} - ${errText}`);
                }

                const data = await res.json();
                console.log("API Data:", data);

                if (data.EURBRLT) {
                    setRate(Number(data.EURBRLT.ask));
                } else {
                    throw new Error("Invalid data format: EURBRLT missing");
                }
            } catch (error: any) {
                console.error("Failed to fetch Euro rate:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRate();
    }, []);

    return <EuroAdviceCard currentRate={rate} />;
}
