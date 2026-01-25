import { useCurrency } from "@/contexts/CurrencyContext";
import { getSortedCurrencies } from "@/lib/currencies";

export function CurrencySelector() {
    const { currency, setCurrency } = useCurrency();
    const currencies = getSortedCurrencies();

    return (
        <select
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all p-2.5 border text-sm"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
        >
            {currencies.map(c => (
                <option key={c.code} value={c.code}>
                    {c.name} ({c.symbol})
                </option>
            ))}
        </select>
    );
}
