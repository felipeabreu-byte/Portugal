import { CURRENCIES } from './currencies';

export interface ConversionResult {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    convertedAmount: number;
    exchangeRate: number;
    advice: string;
}

export interface ExchangeRateResponse {
    result?: string;
    rates?: Record<string, number>;
    base_code?: string;
    error?: string;
}

/**
 * Validates if a currency code is valid according to ISO 4217
 */
export function isValidCurrency(code: string): boolean {
    const upperCode = code.toUpperCase();
    return CURRENCIES.some(c => c.code === upperCode);
}

/**
 * Fetches exchange rates from external API
 * Using exchangerate-api.com free tier
 */
export async function fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const upperFrom = fromCurrency.toUpperCase();
    const upperTo = toCurrency.toUpperCase();

    // Validate currencies
    if (!isValidCurrency(upperFrom)) {
        throw new Error(`Moeda de origem inválida: ${fromCurrency}`);
    }
    if (!isValidCurrency(upperTo)) {
        throw new Error(`Moeda de destino inválida: ${toCurrency}`);
    }

    // Check if currencies are the same
    if (upperFrom === upperTo) {
        return 1.0;
    }

    try {
        // Using exchangerate-api.com free tier (no API key required for basic usage)
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${upperFrom}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Falha ao buscar taxa de câmbio');
        }

        const data: ExchangeRateResponse = await response.json();

        if (data.result === 'error' || !data.rates) {
            throw new Error(data.error || 'Erro ao obter taxas de câmbio');
        }

        const rate = data.rates[upperTo];
        if (!rate) {
            throw new Error(`Taxa não encontrada para ${upperTo}`);
        }

        return rate;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        throw new Error('Não foi possível obter a taxa de câmbio no momento');
    }
}

/**
 * Converts an amount from one currency to another
 */
export async function convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
): Promise<ConversionResult> {
    const upperFrom = fromCurrency.toUpperCase();
    const upperTo = toCurrency.toUpperCase();

    // Check if currencies are the same
    if (upperFrom === upperTo) {
        return {
            fromCurrency: upperFrom,
            toCurrency: upperTo,
            amount,
            convertedAmount: amount,
            exchangeRate: 1.0,
            advice: 'As moedas são iguais. Não é necessária conversão.'
        };
    }

    // Fetch current exchange rate
    const exchangeRate = await fetchExchangeRate(upperFrom, upperTo);
    const convertedAmount = amount * exchangeRate;

    // Generate simple advice
    const advice = `Taxa de câmbio atual: 1 ${upperFrom} = ${exchangeRate.toFixed(4)} ${upperTo}`;

    return {
        fromCurrency: upperFrom,
        toCurrency: upperTo,
        amount,
        convertedAmount,
        exchangeRate,
        advice
    };
}

/**
 * Gets the currency name from code
 */
export function getCurrencyName(code: string): string {
    const currency = CURRENCIES.find(c => c.code === code.toUpperCase());
    return currency ? currency.name : code;
}

/**
 * Gets the currency symbol from code
 */
export function getCurrencySymbol(code: string): string {
    const currency = CURRENCIES.find(c => c.code === code.toUpperCase());
    return currency ? currency.symbol : code;
}
