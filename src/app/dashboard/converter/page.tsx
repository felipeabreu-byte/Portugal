'use client';

import { useState, useEffect } from 'react';
import { LucideArrowRightLeft, LucideRefreshCw, LucideInfo, LucideArrowLeft } from 'lucide-react';
import { getCurrencySymbol, getCurrencyName, getSortedCurrencies } from '@/lib/currencies';
import Link from 'next/link';

interface ConversionResult {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    convertedAmount: number;
    exchangeRate: number;
    advice: string;
}

export default function ConverterPage() {
    const [amount, setAmount] = useState<string>('1000');
    const [fromCurrency, setFromCurrency] = useState<string>('BRL');
    const [toCurrency, setToCurrency] = useState<string>('EUR');
    const [result, setResult] = useState<ConversionResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [initialLoading, setInitialLoading] = useState<boolean>(true);

    // Fetch user's currency settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/convert');
                if (res.ok) {
                    const data = await res.json();
                    setFromCurrency(data.currency || 'BRL');
                }
            } catch (err) {
                console.error('Error fetching settings:', err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // Auto-convert whenever amount or currencies change
    useEffect(() => {
        if (initialLoading) return;

        const timeoutId = setTimeout(() => {
            handleConvert();
        }, 500); // Debounce de 500ms

        return () => clearTimeout(timeoutId);
    }, [amount, fromCurrency, toCurrency, initialLoading]);

    const handleConvert = async () => {
        // Validate amount
        const numAmount = Number(amount);
        if (!amount || numAmount <= 0 || isNaN(numAmount)) {
            setResult(null);
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Check if currencies are the same
            if (fromCurrency === toCurrency) {
                setResult({
                    fromCurrency,
                    toCurrency,
                    amount: numAmount,
                    convertedAmount: numAmount,
                    exchangeRate: 1.0,
                    advice: 'As moedas são iguais. Não é necessária conversão.'
                });
                setLoading(false);
                return;
            }

            // Fetch exchange rate from AwesomeAPI
            // Format: FROM-TO (e.g., BRL-EUR, USD-EUR)
            const pair = `${fromCurrency}-${toCurrency}`;
            const key = `${fromCurrency}${toCurrency}`;

            const res = await fetch(`https://economia.awesomeapi.com.br/last/${pair}`);

            if (!res.ok) {
                throw new Error('Erro ao buscar cotação');
            }

            const data = await res.json();

            if (!data[key]) {
                throw new Error('Par de moedas não encontrado');
            }

            // Use 'ask' for tourism rate (venda/turismo)
            const exchangeRate = Number(data[key].ask);
            const convertedAmount = numAmount * exchangeRate;

            setResult({
                fromCurrency,
                toCurrency,
                amount: numAmount,
                convertedAmount,
                exchangeRate,
                advice: `Taxa de câmbio turismo: 1 ${fromCurrency} = ${exchangeRate.toFixed(4)} ${toCurrency}`
            });
        } catch (err: any) {
            setError(err.message || 'Erro ao converter moeda');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <LucideRefreshCw className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Conversor de Moedas</h2>
                    <p className="text-gray-500 mt-1">Conversão em tempo real com cotação turismo</p>
                </div>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors bg-white px-3 py-2 rounded-lg border shadow-sm"
                >
                    <LucideArrowLeft className="w-4 h-4 mr-2" />
                    Voltar ao Dashboard
                </Link>
            </div>

            {/* Converter Card */}
            <div className="bg-white rounded-xl border shadow-sm p-6 max-w-4xl">
                <div className="space-y-6">
                    {/* Amount Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Valor a Converter
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="1000"
                        />
                    </div>

                    {/* Currency Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                De
                            </label>
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                                {getSortedCurrencies().map(c => (
                                    <option key={c.code} value={c.code}>
                                        {c.code} - {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={swapCurrencies}
                                className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                title="Inverter moedas"
                            >
                                <LucideArrowRightLeft size={20} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Para
                            </label>
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                                {getSortedCurrencies().map(c => (
                                    <option key={c.code} value={c.code}>
                                        {c.code} - {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Loading Indicator */}
                    {loading && (
                        <div className="flex items-center justify-center py-4">
                            <LucideRefreshCw className="animate-spin h-5 w-5 text-blue-600 mr-2" />
                            <span className="text-sm text-gray-600">Convertendo...</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
                            <LucideInfo className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Conversion Result */}
                    {result && !error && !loading && (
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                            {/* Main Result */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6">
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                        {getCurrencySymbol(result.fromCurrency)} {result.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {result.fromCurrency}
                                    </p>
                                    <div className="text-4xl font-bold text-gray-900 mb-2">
                                        {getCurrencySymbol(result.toCurrency)} {result.convertedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {result.toCurrency}
                                    </p>
                                </div>
                            </div>

                            {/* Exchange Rate */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Taxa de Câmbio (Turismo)</span>
                                    <span className="text-sm font-bold text-gray-900">
                                        1 {result.fromCurrency} = {result.exchangeRate.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {result.toCurrency}
                                    </span>
                                </div>
                            </div>

                            {/* Advice */}
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    <LucideInfo className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
                                    <p className="text-sm text-blue-700">{result.advice}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
