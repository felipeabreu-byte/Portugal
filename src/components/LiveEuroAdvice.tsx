"use client";

import { useEffect, useState } from "react";
import { EuroAdviceCard } from "./EuroAdviceCard";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getCurrencySymbol } from "@/lib/currencies";

export function LiveEuroAdvice() {
    const { currency } = useCurrency();
    const currencySymbol = getCurrencySymbol(currency);
    const [rate, setRate] = useState<number>(0);
    const [baseRate, setBaseRate] = useState<number>(6.60);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch base rate from settings
    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.baseRate) {
                    setBaseRate(Number(data.baseRate));
                }
            })
            .catch(err => console.error("Failed to fetch baseRate:", err));
    }, []);

    useEffect(() => {
        const fetchRate = async () => {
            if (currency === "EUR") {
                // Rate is 1:1
                setRate(1);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Try fetching pair EUR-[CURRENCY]
                // AwesomeAPI format: EUR-BRL, EUR-USD, etc.
                const pair = `EUR-${currency}`;
                const key = `EUR${currency}`;
                const res = await fetch(`https://economia.awesomeapi.com.br/last/${pair}`);

                if (!res.ok) {
                    throw new Error("Falha ao buscar cotação");
                }

                const data = await res.json();

                if (data[key]) {
                    setRate(Number(data[key].ask));
                } else {
                    // Fallback or error
                    throw new Error("Par não encontrado");
                }
            } catch (error: any) {
                console.error("Failed to fetch Euro rate:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRate();
    }, [currency]);

    if (loading) {
        return (
            <div className="rounded-xl border border-gray-800 p-4 flex items-center justify-between shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 h-[56px] animate-pulse">
                <div className="space-y-2 w-1/3">
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                </div>
            </div>
        );
    }

    if (error) {
        // If error (e.g. unknown pair), hide component or show basics?
        // Let's just return null to not break UI or show error
        return null;
    }

    return <EuroAdviceCard currentRate={rate} currencySymbol={currencySymbol} baseRate={baseRate} />;
}
