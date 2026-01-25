import { LucideTrendingDown, LucideTrendingUp, LucideInfo } from "lucide-react";
import clsx from "clsx";

type EuroAdviceProps = {
    currentRate: number;
    currencySymbol?: string;
    baseRate?: number;
};

export function EuroAdviceCard({ currentRate, currencySymbol = "R$", baseRate = 6.60 }: EuroAdviceProps) {
    // Use the provided baseRate for comparison logic
    const STANDARD_RATE = baseRate;
    const diffPercent = ((currentRate - STANDARD_RATE) / STANDARD_RATE) * 100;

    // Logic Classification
    let message = "Cotação Atual";
    let statusColor = "text-blue-50";
    let iconColor = "text-white";
    let bgIconColor = "bg-white/20";
    let cardBg = "bg-gradient-to-r from-blue-400/90 to-blue-500/90";
    let icon = <LucideInfo className="h-3.5 w-3.5" />;

    // Apply advice logic based on comparison with base rate (works for all currencies)
    if (currentRate < STANDARD_RATE) {
        message = "Comprar!";
        statusColor = "text-emerald-50";
        iconColor = "text-white";
        bgIconColor = "bg-white/20";
        cardBg = "bg-gradient-to-r from-emerald-400/90 to-emerald-500/90";
        icon = <LucideTrendingDown className="h-3.5 w-3.5" />;
    }

    if (diffPercent <= -15) {
        message = "Muito Barato!";
        statusColor = "text-emerald-50";
        cardBg = "bg-gradient-to-r from-emerald-400/90 to-emerald-500/90";
        icon = <LucideTrendingDown className="h-5 w-5" />;
    } else if (diffPercent >= 4 && diffPercent < 15) {
        message = "Preço em alta";
        statusColor = "text-amber-50";
        cardBg = "bg-gradient-to-r from-amber-400/90 to-amber-500/90";
        icon = <LucideTrendingUp className="h-3.5 w-3.5" />;
    } else if (diffPercent >= 15) {
        message = "Muito caro";
        statusColor = "text-red-50";
        cardBg = "bg-gradient-to-r from-red-400/90 to-red-500/90";
        icon = <LucideTrendingUp className="h-3.5 w-3.5" />;
    }

    return (
        <div className={clsx("rounded-lg px-4 py-2 flex flex-row items-center justify-between shadow-sm transition-all h-[56px] border border-white/10 backdrop-blur-sm", cardBg)}>
            <div>
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">Euro Comercial</span>
                    <div className={clsx("p-0.5 rounded-md backdrop-blur-sm", bgIconColor, iconColor)}>
                        {icon}
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <div className="text-lg font-bold leading-none text-white">
                        {currencySymbol} {currentRate.toLocaleString('pt-BR', { minimumFractionDigits: 3 })}
                    </div>
                    <p className={clsx("font-medium text-[10px]", statusColor)}>{message}</p>
                </div>
            </div>

            <div className="text-right flex flex-col justify-end h-full">
                <p className="text-[9px] text-white/70">
                    Ref: {currencySymbol} {STANDARD_RATE.toFixed(2)}
                </p>
                <p className={clsx("text-[9px] font-medium", diffPercent > 0 ? "text-red-100" : "text-emerald-100")}>
                    {diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}%
                </p>
            </div>
        </div>
    );
}
