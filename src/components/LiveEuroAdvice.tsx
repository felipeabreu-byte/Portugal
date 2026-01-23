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
            <div className="rounded-xl border border-gray-800 p-4 flex items-center justify-between shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 h-[100px] animate-pulse">
                <div className="space-y-2 w-1/3">
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                    <div className="h-6 bg-gray-700 rounded w-2/3"></div>
                </div>
                <div className="space-y-2 w-1/3 flex flex-col items-end">
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-500/20 p-4 flex items-center justify-center shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 text-red-400 h-[100px]">
                <p className="text-sm">Erro ao carregar cotação</p>
            </div>
        );
    }

    return <EuroAdviceCard currentRate={rate} />;
}
