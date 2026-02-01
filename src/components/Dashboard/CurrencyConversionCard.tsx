'use client';

import { useState, useEffect } from 'react';
import { LucideArrowRightLeft, LucideRefreshCw, LucideTrendingUp, LucideTrendingDown, LucideAlertCircle, LucideInfo } from 'lucide-react';
import { getCurrencySymbol, getCurrencyName } from '@/lib/currencies';

interface ConversionResult {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    convertedAmount: number;
    exchangeRate: number;
    baseRate?: number;
    advice: string;
    rateComparison?: 'better' | 'worse' | 'similar';
    volatilityWarning?: string;
}

export function CurrencyConversionCard() {
    const [amount, setAmount] = useState<string>('1000');
    const [fromCurrency, setFromCurrency] = useState<string>('BRL');
    const [baseRate, setBaseRate] = useState<number>(6.60);
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
                    setBaseRate(data.baseRate || 6.60);
                }
            } catch (err) {
                console.error('Error fetching settings:', err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // Auto-convert on mount and when currency changes
    useEffect(() => {
        if (!initialLoading && fromCurrency) {
            handleConvert();
        }
    }, [fromCurrency, initialLoading]);

    const handleConvert = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Number(amount),
                    fromCurrency,
                    toCurrency: 'EUR'
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Erro ao converter');
            }

            const data: ConversionResult = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Erro ao converter moeda');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="bg-white/60 backdrop-blur-md rounded-xl border border-white/60 p-5 shadow-sm">
                <div className="flex items-center justify-center h-32">
                    <LucideRefreshCw className="animate-spin h-6 w-6 text-blue-600" />
                </div>
            </div>
        );
    }

    // Determine color scheme based on comparison
    const getComparisonColor = () => {
        if (!result?.rateComparison) return 'blue';
        switch (result.rateComparison) {
            case 'better':
                return 'green';
            case 'worse':
                return 'red';
            default:
                return 'gray';
        }
    };

    const color = getComparisonColor();

    return (
        <div className="bg-white/60 backdrop-blur-md rounded-xl border border-white/60 p-5 shadow-sm mb-6 relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <div className={`text-${color}-600`}>
                    <LucideArrowRightLeft size={120} />
                </div>
            </div>

            <div className="flex flex-col gap-5 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
                    <div className="flex items-center gap-3">
                        <div className={`bg-${color}-50 p-2.5 rounded-full text-${color}-600 shadow-sm`}>
                            <LucideArrowRightLeft size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Conversão de Moeda</h3>
                            <p className="text-xs text-gray-500">Assistente financeiro de câmbio</p>
                        </div>
                    </div>
                    <button
                        onClick={handleConvert}
                        disabled={loading}
                        className="text-gray-500 hover:text-blue-600 hover:bg-white/50 p-2 rounded-full transition-all disabled:opacity-50"
                        title="Atualizar cotação"
                    >
                        <LucideRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {/* Conversion Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Valor em {getCurrencyName(fromCurrency)}
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                {getCurrencySymbol(fromCurrency)}
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleConvert()}
                                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="1000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Moeda de Origem
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={fromCurrency}
                                readOnly
                                className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
                            />
                            <span className="text-gray-400">→</span>
                            <input
                                type="text"
                                value="EUR"
                                readOnly
                                className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Configure em <a href="/dashboard/settings" className="text-blue-600 hover:underline">Configurações</a>
                        </p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                        <LucideAlertCircle className="text-red-500 mt-0.5" size={16} />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Conversion Result */}
                {result && !error && (
                    <div className="space-y-4">
                        {/* Main Result */}
                        <div className={`bg-${color}-50/50 border border-${color}-100/50 rounded-lg p-4`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-gray-600">Valor Convertido</span>
                                {result.rateComparison === 'better' && <LucideTrendingUp className="text-green-500" size={18} />}
                                {result.rateComparison === 'worse' && <LucideTrendingDown className="text-red-500" size={18} />}
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                                {getCurrencySymbol('EUR')} {result.convertedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>

                        {/* Exchange Rate Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-white/40 p-3 rounded-lg border border-white/50 shadow-sm">
                                <span className="text-xs uppercase font-bold text-gray-500 tracking-wider block mb-1">
                                    Taxa de Câmbio
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                    1 {result.fromCurrency} = {result.exchangeRate.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} EUR
                                </span>
                            </div>

                            {result.baseRate && (
                                <div className="bg-white/40 p-3 rounded-lg border border-white/50 shadow-sm">
                                    <span className="text-xs uppercase font-bold text-gray-500 tracking-wider block mb-1">
                                        Taxa de Referência
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">
                                        1 {result.fromCurrency} = {result.baseRate.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} EUR
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Advice */}
                        <div className={`bg-${color}-50/50 p-3 rounded-lg border border-${color}-100/50 shadow-sm`}>
                            <div className="flex items-start gap-2">
                                <LucideInfo className={`text-${color}-500 mt-0.5 flex-shrink-0`} size={16} />
                                <div>
                                    <span className={`text-xs font-medium text-${color}-700 block mb-1`}>
                                        {result.advice}
                                    </span>
                                    {result.volatilityWarning && (
                                        <span className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                                            <LucideAlertCircle size={12} />
                                            {result.volatilityWarning}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
