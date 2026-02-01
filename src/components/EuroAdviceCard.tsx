type CurrencyRateCardProps = {
    currentRate: number;
    currencySymbol?: string;
    currencyCode?: string;
};

export function EuroAdviceCard({ currentRate, currencySymbol = "R$", currencyCode = "BRL" }: CurrencyRateCardProps) {
    return (
        <div className="rounded-lg px-4 py-2 flex flex-row items-center justify-between shadow-sm transition-all h-[56px] border border-white/10 backdrop-blur-sm bg-gradient-to-r from-blue-400/90 to-blue-500/90">
            <div>
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">
                        Cotação {currencyCode}
                    </span>
                </div>
                <div className="flex items-baseline gap-2">
                    <div className="text-lg font-bold leading-none text-white">
                        {currencySymbol} {currentRate.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                    </div>
                </div>
            </div>

            <div className="text-right flex flex-col justify-end h-full">
                <p className="text-[9px] text-white/70">
                    Valor Turismo
                </p>
            </div>
        </div>
    );
}
