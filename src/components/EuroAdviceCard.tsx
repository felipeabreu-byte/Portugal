import { LucideTrendingDown, LucideTrendingUp, LucideInfo } from "lucide-react";
import clsx from "clsx";

type EuroAdviceProps = {
    currentRate: number;
};

export function EuroAdviceCard({ currentRate }: EuroAdviceProps) {
    const STANDARD_RATE = 6.60;
    const diffPercent = ((currentRate - STANDARD_RATE) / STANDARD_RATE) * 100;

    // Logic Classification
    let status: "VERY_CHEAP" | "GOOD" | "NEUTRAL" | "WARNING" | "EXPENSIVE" = "NEUTRAL";
    let message = "Preço razoável";
    let colorClass = "bg-gray-50 border-gray-200 text-gray-700";
    let icon = <LucideInfo className="h-5 w-5" />;

    if (currentRate < STANDARD_RATE) {
        status = "GOOD";
        message = "Dia bom para comprar!";
        colorClass = "bg-green-50 border-green-200 text-green-700";
        icon = <LucideTrendingDown className="h-5 w-5" />;
    }

    if (diffPercent <= -15) {
        status = "VERY_CHEAP";
        message = "Muito Barato! Aproveite!";
        colorClass = "bg-emerald-100 border-emerald-300 text-emerald-800 ring-2 ring-emerald-400 ring-opacity-50 animate-pulse";
        icon = <LucideTrendingDown className="h-6 w-6" />;
    } else if (diffPercent >= 4 && diffPercent < 15) {
        status = "WARNING";
        message = "Preço em alta (Atenção)";
        colorClass = "bg-yellow-50 border-yellow-200 text-yellow-700";
        icon = <LucideTrendingUp className="h-5 w-5" />;
    } else if (diffPercent >= 15) {
        status = "EXPENSIVE";
        message = "Muito caro! Aguarde.";
        colorClass = "bg-red-50 border-red-200 text-red-700";
        icon = <LucideTrendingUp className="h-5 w-5" />;
    }

    return (
        <div className={clsx("rounded-xl border p-4 flex flex-row items-center justify-between shadow-sm transition-all h-[100px]", colorClass)}>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium opacity-80 uppercase tracking-wider">Euro Turismo</span>
                    {icon}
                </div>
                <div className="text-2xl font-bold leading-none">
                    R$ {currentRate.toLocaleString('pt-BR', { minimumFractionDigits: 3 })}
                </div>
                <p className="font-semibold text-sm mt-1 text-gray-800">{message}</p>
            </div>

            <div className="text-right flex flex-col justify-end h-full">
                <p className="text-[10px] opacity-70">
                    Ref: R$ {STANDARD_RATE.toFixed(2)}
                </p>
                <p className={clsx("text-[10px] font-medium", diffPercent > 0 ? "text-red-500" : "text-green-500")}>
                    {diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}%
                </p>
            </div>
        </div>
    );
}
