export type Currency = {
    code: string;
    name: string;
    symbol: string;
};

export const PINNED_CURRENCIES: string[] = ["EUR", "USD", "GBP", "BRL", "CHF"];

export const CURRENCIES: Currency[] = [
    // Pinned
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "USD", name: "Dólar Americano", symbol: "$" },
    { code: "GBP", name: "Libra Esterlina", symbol: "£" },
    { code: "CHF", name: "Franco Suíço", symbol: "Fr" },
    { code: "BRL", name: "Real Brasileiro", symbol: "R$" },
    // Others
    { code: "JPY", name: "Iene Japonês", symbol: "¥" },
    { code: "CNY", name: "Yuan Chinês", symbol: "¥" },
    { code: "AUD", name: "Dólar Australiano", symbol: "A$" },
    { code: "CAD", name: "Dólar Canadense", symbol: "C$" },
    { code: "HKD", name: "Dólar de Hong Kong", symbol: "HK$" },
    { code: "SGD", name: "Dólar de Singapura", symbol: "S$" },
    { code: "SEK", name: "Coroa Sueca", symbol: "kr" },
    { code: "KRW", name: "Won Sul-Coreano", symbol: "₩" },
    { code: "NOK", name: "Coroa Norueguesa", symbol: "kr" },
    { code: "NZD", name: "Dólar Neozelandês", symbol: "NZ$" },
    { code: "INR", name: "Rúpia Indiana", symbol: "₹" },
    { code: "MXN", name: "Peso Mexicano", symbol: "Mex$" },
    { code: "TWD", name: "Novo Dólar Taiuanês", symbol: "NT$" },
    { code: "ZAR", name: "Rand Sul-Africano", symbol: "R" },
    { code: "TRY", name: "Lira Turca", symbol: "₺" },
    { code: "DKK", name: "Coroa Dinamarquesa", symbol: "kr" },
    { code: "PLN", name: "Złoty Polonês", symbol: "zł" },
    { code: "THB", name: "Baht Tailandês", symbol: "฿" },
    { code: "IDR", name: "Rupia Indonésia", symbol: "Rp" },
    { code: "HUF", name: "Forint Húngaro", symbol: "Ft" },
    { code: "CZK", name: "Coroa Checa", symbol: "Kč" },
    { code: "ILS", name: "Novo Shekel Israelense", symbol: "₪" },
    { code: "CLP", name: "Peso Chileno", symbol: "CLP$" },
    { code: "PHP", name: "Peso Filipino", symbol: "₱" },
    { code: "AED", name: "Dirham dos Emirados", symbol: "د.إ" },
    { code: "COP", name: "Peso Colombiano", symbol: "COL$" },
    { code: "SAR", name: "Riyal Saudita", symbol: "﷼" },
    { code: "MYR", name: "Ringgit Malaio", symbol: "RM" },
    { code: "RON", name: "Leu Romeno", symbol: "lei" },
    { code: "ARS", name: "Peso Argentino", symbol: "ARS$" }
];

export function getCurrencySymbol(code: string): string {
    const currency = CURRENCIES.find(c => c.code === code);
    return currency ? currency.symbol : code;
}

export function getCurrencyName(code: string): string {
    const currency = CURRENCIES.find(c => c.code === code);
    return currency ? currency.name : code;
}

export function getSortedCurrencies(): Currency[] {
    const pinned = CURRENCIES.filter(c => PINNED_CURRENCIES.includes(c.code));
    const others = CURRENCIES.filter(c => !PINNED_CURRENCIES.includes(c.code)).sort((a, b) => a.name.localeCompare(b.name));
    return [...pinned, ...others];
}
