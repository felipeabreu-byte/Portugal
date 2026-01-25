'use client';

import { useState } from 'react';
import { Printer, Check, ShoppingBag, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChecklistCategory, ChecklistItem, Purchase } from '@prisma/client';
import { useCurrency } from "@/contexts/CurrencyContext";
import { getCurrencySymbol } from "@/lib/currencies";

interface CategoryWithItems extends ChecklistCategory {
    items: ChecklistItem[];
}

interface PrintManagerProps {
    checklistCategories: CategoryWithItems[];
    purchases: Purchase[];
    userSettings: {
        targetAmount: number;
    };
    totals: {
        totalEur: number;
        totalBrl: number;
    };
}

export function PrintManager({ checklistCategories, purchases, userSettings, totals }: PrintManagerProps) {
    const { currency } = useCurrency();
    const currencySymbol = getCurrencySymbol(currency);
    const [options, setOptions] = useState({
        summary: true,
        checklist: true,
        purchases: false
    });

    const handlePrint = () => {
        window.print();
    };

    const toggleOption = (key: keyof typeof options) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-8">
            {/* Control Panel (Screen Only) */}
            <div className="print:hidden bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <Printer className="text-blue-600" />
                    Gerar Relatório
                </h2>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <button
                        onClick={() => toggleOption('summary')}
                        className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            options.summary
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-zinc-100 hover:border-zinc-200 text-zinc-600"
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <PieChart size={24} />
                            <span className="font-bold">Resumo Financeiro</span>
                        </div>
                        <p className="text-sm opacity-80">Metas, Total Euro e Câmbio</p>
                    </button>

                    <button
                        onClick={() => toggleOption('checklist')}
                        className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            options.checklist
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-zinc-100 hover:border-zinc-200 text-zinc-600"
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Check size={24} />
                            <span className="font-bold">Checklists</span>
                        </div>
                        <p className="text-sm opacity-80">{checklistCategories.length} categorias cadastradas</p>
                    </button>

                    <button
                        onClick={() => toggleOption('purchases')}
                        className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            options.purchases
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-zinc-100 hover:border-zinc-200 text-zinc-600"
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <ShoppingBag size={24} />
                            <span className="font-bold">Compras</span>
                        </div>
                        <p className="text-sm opacity-80">{purchases.length} registros de compra</p>
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                    >
                        <Printer size={20} />
                        Imprimir Relatório
                    </button>
                </div>
            </div>

            {/* Print Content (Visible on Print + Preview on Screen) */}
            <div className="bg-white p-8 md:p-12 shadow-sm border border-zinc-100 min-h-[500px] print:shadow-none print:border-none print:p-0 print:min-h-0">

                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6 mb-8 print:pb-4 print:mb-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-blue-900 mb-2 print:text-xl print:mb-1">Plano Portugal</h1>
                        <p className="text-zinc-500 print:text-xs">Relatório de Planejamento</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-zinc-400 print:text-[10px]">Gerado em</p>
                        <p className="font-medium text-zinc-700 print:text-xs">{new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>

                {/* Summary Section */}
                {options.summary && (
                    <div className="mb-12 print:mb-6">
                        <h3 className="text-xl font-bold text-zinc-900 mb-4 border-l-4 border-blue-500 pl-3 print:text-base print:mb-2 print:pl-2 print:border-l-2">Resumo Financeiro</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-2">
                            <div className="p-4 bg-zinc-50 rounded-lg print:border print:border-zinc-200 print:p-2">
                                <p className="text-xs text-zinc-500 uppercase font-semibold print:text-[10px]">Total Acumulado</p>
                                <p className="text-2xl font-bold text-blue-900 print:text-lg">{currency} {totals.totalEur.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="p-4 bg-zinc-50 rounded-lg print:border print:border-zinc-200 print:p-2">
                                <p className="text-xs text-zinc-500 uppercase font-semibold print:text-[10px]">Investimento (R$)</p>
                                <p className="text-2xl font-bold text-zinc-700 print:text-lg">R$ {totals.totalBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="p-4 bg-zinc-50 rounded-lg print:border print:border-zinc-200 print:p-2">
                                <p className="text-xs text-zinc-500 uppercase font-semibold print:text-[10px]">Meta</p>
                                <p className="text-2xl font-bold text-zinc-700 print:text-lg">{currency} {userSettings.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Checklist Section */}
                {options.checklist && (
                    <div className="mb-12 print:mb-6">
                        <h3 className="text-xl font-bold text-zinc-900 mb-6 border-l-4 border-blue-500 pl-3 print:text-base print:mb-2 print:pl-2 print:border-l-2">Checklists</h3>
                        <div className="columns-1 md:columns-2 gap-8 print:block print:columns-2 print:gap-4">
                            {checklistCategories.map((category) => (
                                <div key={category.id} className="break-inside-avoid mb-6 border rounded-xl p-0 overflow-hidden print:border-zinc-300 print:mb-4 print:overflow-visible">
                                    <div className="bg-zinc-50 p-3 border-b border-zinc-100 print:bg-zinc-100 print:p-1.5">
                                        <h4 className="font-bold text-zinc-800 print:text-sm">{category.title}</h4>
                                    </div>
                                    <div className="p-2 print:p-1">
                                        {category.items.length === 0 ? (
                                            <p className="text-sm text-zinc-400 p-2 italic print:text-[10px] print:p-0">Nenhum item.</p>
                                        ) : (
                                            <ul className="space-y-0">
                                                {category.items.map(item => (
                                                    <li key={item.id} className="flex items-start gap-3 p-2 border-b border-zinc-50 last:border-0 print:p-1 print:gap-2">
                                                        <div className={cn(
                                                            "w-4 h-4 rounded border flex-shrink-0 mt-1 flex items-center justify-center print:border-zinc-800 print:w-3 print:h-3 print:mt-0.5",
                                                            item.status === 'COMPLETED' ? "bg-green-500 border-green-500 print:bg-black/20" : "border-zinc-300"
                                                        )}>
                                                            {item.status === 'COMPLETED' && <Check size={10} className="text-white print:text-black print:w-2 print:h-2" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className={cn(
                                                                "text-sm font-medium print:text-xs",
                                                                item.status === 'COMPLETED' ? "text-zinc-500 line-through" : "text-zinc-800"
                                                            )}>
                                                                {item.title}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Purchases Section */}
                {options.purchases && (
                    <div className="mb-8 print:mb-4">
                        <h3 className="text-xl font-bold text-zinc-900 mb-4 border-l-4 border-blue-500 pl-3 print:text-base print:mb-2 print:pl-2 print:border-l-2">Relatório de Compras</h3>
                        <table className="w-full text-sm text-left shadow-sm rounded-lg overflow-hidden border print:border-zinc-300 print:text-xs print:overflow-visible">
                            <thead className="bg-zinc-50 text-zinc-700 font-bold print:bg-zinc-100">
                                <tr>
                                    <th className="p-3 border-b print:p-1.5">Data</th>
                                    <th className="p-3 border-b print:p-1.5">Descrição</th>
                                    <th className="p-3 border-b text-right print:p-1.5">{currency} ({currencySymbol})</th>
                                    <th className="p-3 border-b text-right print:p-1.5">Reais (R$)</th>
                                    <th className="p-3 border-b text-right print:p-1.5">Cotação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 print:divide-zinc-300">
                                {purchases.map(p => (
                                    <tr key={p.id}>
                                        <td className="p-3 print:p-1.5">{new Date(p.date).toLocaleDateString('pt-BR')}</td>
                                        <td className="p-3 max-w-[200px] truncate print:p-1.5">{p.notes || '-'}</td>
                                        <td className="p-3 text-right font-medium print:p-1.5">{currency} {Number(p.amountEur).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                        <td className="p-3 text-right print:p-1.5">R$ {Number(p.totalBrl).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                        <td className="p-3 text-right text-zinc-500 print:p-1.5">R$ {Number(p.exchangeRate).toLocaleString('pt-BR', { minimumFractionDigits: 3 })}</td>
                                    </tr>
                                ))}
                                {purchases.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-zinc-400 italic print:p-2">Nenhuma compra registrada.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-6 border-t text-center text-zinc-400 text-xs hidden print:block print:mt-4 print:pt-2 print:text-[10px]">
                    ReStarta - Gerado automaticamente
                </div>
            </div>
        </div>
    );
}
