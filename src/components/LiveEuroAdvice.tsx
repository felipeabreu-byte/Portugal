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
                const res = await fetch("https://economia.awesomeapi.com.br/last/EUR-BRLT");

                if (!res.ok) {
                    throw new Error("Falha ao buscar cotação");
                }

                const data = await res.json();

                if (data.EURBRLT) {
                    setRate(Number(data.EURBRLT.ask));
                } else {
                    throw new Error("Formato de dados inválido");
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

    if (loading) {
        return (
            <div className="rounded-xl border p-6 flex flex-col justify-between shadow-sm bg-gray-50 h-[180px] animate-pulse">
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border p-6 flex items-center justify-center shadow-sm bg-red-50 text-red-600 h-[180px]">
                <p>Erro ao carregar cotação</p>
            </div>
        );
    }

    return <EuroAdviceCard currentRate={rate} />;
}
