"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LucidePlus, LucideTrash2, LucideCalculator, LucideRotateCcw } from "lucide-react";
import { createIncome, deleteIncome, updateIncome, createExpense, deleteExpense, loadSuggestions, updateExpense } from "@/actions/planning";
import { formatCurrency, formatEuNumber, parseEuNumber } from "@/lib/utils";
import { ConfirmationModal } from "@/components/UI/ConfirmationModal";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Expense {
    id: string;
    description: string;
    amountEur: number;
    startMonth: number;
    durationMonths: number;
}

interface Income {
    id: string;
    description: string;
    amountEur: number;
    startMonth: number;
    durationMonths: number;
}

interface ExpensePlannerProps {
    initialExpenses: Expense[];
    initialIncomes: Income[];
}

export function ExpensePlanner({ initialExpenses, initialIncomes }: ExpensePlannerProps) {
    const router = useRouter();
    const { currency } = useCurrency(); // Kept for context if needed
    const currencyLabel = "€"; // Hardcoding to Euro for Planning

    // Expenses State
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses.map(e => ({ ...e, amountEur: Number(e.amountEur) })));
    const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);

    // Incomes State
    const [incomes, setIncomes] = useState<Income[]>(initialIncomes.map(i => ({ ...i, amountEur: Number(i.amountEur) })));
    const [deleteIncomeId, setDeleteIncomeId] = useState<string | null>(null);

    useEffect(() => {
        setExpenses(initialExpenses.map(e => ({ ...e, amountEur: Number(e.amountEur) })));
    }, [initialExpenses]);

    useEffect(() => {
        setIncomes(initialIncomes.map(i => ({ ...i, amountEur: Number(i.amountEur) })));
    }, [initialIncomes]);

    const [loading, setLoading] = useState(false);

    // Quick Add Expense State
    const [newExpDesc, setNewExpDesc] = useState("");
    const [newExpAmount, setNewExpAmount] = useState("");
    const [newExpStart, setNewExpStart] = useState("1");
    const [newExpDuration, setNewExpDuration] = useState("1");

    // Quick Add Income State
    const [newIncDesc, setNewIncDesc] = useState("");
    const [newIncAmount, setNewIncAmount] = useState("");
    const [newIncStart, setNewIncStart] = useState("1");
    const [newIncDuration, setNewIncDuration] = useState("1");

    // --- Expense Handlers ---

    const handleAddExpense = async () => {
        if (!newExpDesc || !newExpAmount) return;
        setLoading(true);
        try {
            await createExpense({
                description: newExpDesc,
                amountEur: parseEuNumber(newExpAmount),
                startMonth: parseInt(newExpStart),
                durationMonths: parseInt(newExpDuration)
            });
            setNewExpDesc("");
            setNewExpAmount("");
            setNewExpStart("1");
            setNewExpDuration("1");
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteExpense = async () => {
        if (!deleteExpenseId) return;
        await deleteExpense(deleteExpenseId);
        setDeleteExpenseId(null);
        router.refresh();
    };

    const handleUpdateExpense = async (id: string, data: Partial<Expense>) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...data } as Expense : e));
        const current = expenses.find(e => e.id === id);
        if (!current) return;
        const updated = { ...current, ...data };
        try {
            await updateExpense(id, {
                description: updated.description,
                amountEur: updated.amountEur,
                startMonth: updated.startMonth,
                durationMonths: updated.durationMonths
            });
            router.refresh();
        } catch (error) {
            console.error("Failed to update expense", error);
            router.refresh();
        }
    };

    // --- Income Handlers ---

    const handleAddIncome = async () => {
        if (!newIncDesc || !newIncAmount) return;
        setLoading(true);
        try {
            await createIncome({
                description: newIncDesc,
                amountEur: parseEuNumber(newIncAmount),
                startMonth: parseInt(newIncStart),
                durationMonths: parseInt(newIncDuration)
            });
            setNewIncDesc("");
            setNewIncAmount("");
            setNewIncStart("1");
            setNewIncDuration("1");
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteIncome = async () => {
        if (!deleteIncomeId) return;
        await deleteIncome(deleteIncomeId);
        setDeleteIncomeId(null);
        router.refresh();
    };

    const handleUpdateIncome = async (id: string, data: Partial<Income>) => {
        setIncomes(prev => prev.map(i => i.id === id ? { ...i, ...data } as Income : i));
        const current = incomes.find(i => i.id === id);
        if (!current) return;
        const updated = { ...current, ...data };
        try {
            await updateIncome(id, {
                description: updated.description,
                amountEur: updated.amountEur,
                startMonth: updated.startMonth,
                durationMonths: updated.durationMonths
            });
            router.refresh();
        } catch (error) {
            console.error("Failed to update income", error);
            router.refresh();
        }
    };

    const handleLoadSuggestions = async () => {
        setLoading(true);
        await loadSuggestions();
        setLoading(false);
        router.refresh();
    };

    const totalCost = expenses.reduce((acc, curr) => acc + (curr.amountEur * curr.durationMonths), 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + (curr.amountEur * curr.durationMonths), 0);
    const netBalance = totalIncome - totalCost;

    return (
        <div className="space-y-8">
            <ConfirmationModal
                isOpen={!!deleteExpenseId}
                onClose={() => setDeleteExpenseId(null)}
                onConfirm={confirmDeleteExpense}
                title="Excluir Gasto"
                message="Tem certeza que deseja remover este item? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                isDangerous
            />
            <ConfirmationModal
                isOpen={!!deleteIncomeId}
                onClose={() => setDeleteIncomeId(null)}
                onConfirm={confirmDeleteIncome}
                title="Excluir Renda"
                message="Tem certeza que deseja remover esta renda? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                isDangerous
            />

            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Planejamento Financeiro</h3>
                    <p className="text-sm text-gray-500">Organize suas previsões de gastos e rendas.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleLoadSuggestions}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                        <LucideRotateCcw size={16} />
                        Sugestões de Gastos
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* --- INCOMES SECTION --- */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                            <div className="p-1.5 bg-green-100 rounded-lg"><LucidePlus size={18} /></div>
                            <h4 className="font-bold text-lg">Rendas Previstas</h4>
                        </div>

                        {/* Add Income Form */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-500">
                            <h4 className="font-semibold mb-3 text-xs uppercase text-gray-500 tracking-wider">Nova Renda</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                                <div className="sm:col-span-4">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Descrição</label>
                                    <input
                                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-green-500 focus:border-green-500"
                                        placeholder="Ex: Salário, Freela"
                                        value={newIncDesc}
                                        onChange={e => setNewIncDesc(e.target.value)}
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Mensal ({currencyLabel})</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-green-500 focus:border-green-500"
                                        placeholder="0,00"
                                        value={newIncAmount}
                                        onChange={e => setNewIncAmount(e.target.value)}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Início (Mês)</label>
                                    <select
                                        className="w-full text-sm border-gray-200 rounded-lg"
                                        value={newIncStart}
                                        onChange={e => setNewIncStart(e.target.value)}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(m => <option key={m} value={m}>{m}º</option>)}
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Duração</label>
                                    <select
                                        className="w-full text-sm border-gray-200 rounded-lg"
                                        value={newIncDuration}
                                        onChange={e => setNewIncDuration(e.target.value)}
                                    >
                                        {[1, 3, 6, 12, 24].map(m => <option key={m} value={m}>{m} meses</option>)}
                                    </select>
                                </div>
                                <div className="sm:col-span-1">
                                    <button
                                        onClick={handleAddIncome}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                    >
                                        <LucidePlus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Incomes List */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-gray-600">Descrição</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 w-36">Valor Mensal ({currencyLabel})</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 w-24">Início</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 w-24">Duração</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 w-28">Total</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 text-right w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {incomes.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                                Nenhuma renda planejada.
                                            </td>
                                        </tr>
                                    )}
                                    {incomes.map((income) => (
                                        <EditableRow
                                            key={income.id}
                                            expense={income}
                                            onUpdate={(data) => handleUpdateIncome(income.id, data)}
                                            onDelete={() => setDeleteIncomeId(income.id)}
                                            type="income"
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* --- EXPENSES SECTION --- */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-red-700 mb-2">
                            <div className="p-1.5 bg-red-100 rounded-lg"><LucideTrash2 size={18} /></div>
                            <h4 className="font-bold text-lg">Gastos Previstos</h4>
                        </div>

                        {/* Add Expense Form */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-red-500">
                            <h4 className="font-semibold mb-3 text-xs uppercase text-gray-500 tracking-wider">Novo Gasto</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                                <div className="sm:col-span-4">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Descrição</label>
                                    <input
                                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="Ex: Aluguel"
                                        value={newExpDesc}
                                        onChange={e => setNewExpDesc(e.target.value)}
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Mensal ({currencyLabel})</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="0,00"
                                        value={newExpAmount}
                                        onChange={e => setNewExpAmount(e.target.value)}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Início (Mês)</label>
                                    <select
                                        className="w-full text-sm border-gray-200 rounded-lg"
                                        value={newExpStart}
                                        onChange={e => setNewExpStart(e.target.value)}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(m => <option key={m} value={m}>{m}º</option>)}
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Duração</label>
                                    <select
                                        className="w-full text-sm border-gray-200 rounded-lg"
                                        value={newExpDuration}
                                        onChange={e => setNewExpDuration(e.target.value)}
                                    >
                                        {[1, 3, 6, 12, 24].map(m => <option key={m} value={m}>{m} meses</option>)}
                                    </select>
                                </div>
                                <div className="sm:col-span-1">
                                    <button
                                        onClick={handleAddExpense}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    >
                                        <LucidePlus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Expenses List */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-gray-600">Descrição</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 w-36">Valor Mensal</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 w-24">Início</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 w-24">Duração</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 w-28">Total</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 text-right w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {expenses.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                                Nenhum gasto planejado.
                                            </td>
                                        </tr>
                                    )}
                                    {expenses.map((expense) => (
                                        <EditableRow
                                            key={expense.id}
                                            expense={expense}
                                            onUpdate={(data) => handleUpdateExpense(expense.id, data)}
                                            onDelete={() => setDeleteExpenseId(expense.id)}
                                            type="expense"
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Summary Column */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-xl sticky top-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <LucideCalculator size={24} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold">Resumo Financeiro</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <p className="text-gray-400 text-xs uppercase tracking-wide">Renda Total</p>
                                    <span className="text-green-400 text-xs font-mono bg-green-900/50 px-2 py-0.5 rounded">+ Receita</span>
                                </div>
                                <p className="text-2xl font-bold tracking-tight text-green-400">
                                    {formatCurrency(totalIncome, 'EUR')}
                                </p>
                            </div>

                            <div className="w-full h-px bg-gray-700/50"></div>

                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <p className="text-gray-400 text-xs uppercase tracking-wide">Custo Total</p>
                                    <span className="text-red-400 text-xs font-mono bg-red-900/50 px-2 py-0.5 rounded">- Despesa</span>
                                </div>
                                <p className="text-2xl font-bold tracking-tight text-red-400">
                                    {formatCurrency(totalCost, 'EUR')}
                                </p>
                            </div>

                            <div className="w-full h-px bg-gray-700/50"></div>

                            <div>
                                <p className="text-blue-100 text-sm mb-1 font-semibold">Saldo Final Estimado</p>
                                <p className={`text-4xl font-extrabold tracking-tight ${netBalance >= 0 ? 'text-white' : 'text-red-300'}`}>
                                    {formatCurrency(netBalance, 'EUR')}
                                </p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10 mt-4">
                                <p className={`text-xs mb-2 font-bold uppercase tracking-wider ${netBalance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                    {netBalance >= 0 ? 'Bom Planejamento!' : 'Atenção Necessária'}
                                </p>
                                <p className="text-sm font-medium leading-relaxed text-gray-200">
                                    {netBalance >= 0
                                        ? "Sua renda cobre os gastos estimados. Continue assim para garantir uma reserva."
                                        : "Seus gastos superam a renda prevista. Tente reduzir custos ou encontrar rendas extras."
                                    }
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function EditableRow({ expense, onUpdate, onDelete, type }: { expense: Expense | Income, onUpdate: (data: Partial<Expense | Income>) => void, onDelete: () => void, type: 'income' | 'expense' }) {
    const { currency } = useCurrency(); // kept if needed for something else

    // Local state for immediate feedback
    const [localData, setLocalData] = useState(expense);
    const [amountStr, setAmountStr] = useState(formatEuNumber(expense.amountEur));

    useEffect(() => {
        setLocalData(expense);
        setAmountStr(formatEuNumber(expense.amountEur));
    }, [expense]);

    const handleBlur = (field: keyof (Expense | Income), value: any) => {
        // @ts-ignore
        if (value == expense[field]) return; // Check against original prop
        onUpdate({ [field]: value });
    };

    const handleAmountBlur = () => {
        const val = parseEuNumber(amountStr);
        setAmountStr(formatEuNumber(val));
        if (val !== expense.amountEur) { // Check against original prop
            onUpdate({ amountEur: val });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: keyof (Expense | Income) | 'amountStr', value: any) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    // Derived total calculation for display
    const currentTotal = localData.amountEur * localData.durationMonths;
    const focusColor = type === 'income' ? 'focus:border-green-500 focus:ring-green-500' : 'focus:border-red-500 focus:ring-red-500 text-red-700';
    const textColor = type === 'income' ? 'text-green-600' : 'text-gray-800';

    return (
        <tr className="hover:bg-gray-50 group">
            {/* Description */}
            <td className="px-4 py-3">
                <input
                    className={`w-full bg-transparent border-transparent hover:border-gray-200 focus:ring-1 rounded px-1 -ml-1 ${textColor} font-medium transition-all ${focusColor}`}
                    value={localData.description}
                    // @ts-ignore
                    onChange={(e) => setLocalData({ ...localData, description: e.target.value })}
                    onBlur={(e) => handleBlur('description', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'description', e.currentTarget.value)}
                />
            </td>
            {/* Monthly Value */}
            <td className="px-4 py-3">
                <div className="relative flex items-center -ml-1">
                    <span className="text-gray-500 mr-1 pl-1">€</span>
                    <input
                        type="text"
                        className={`w-full bg-transparent border-transparent hover:border-gray-200 focus:ring-1 rounded px-1 transition-all font-medium ${focusColor} text-gray-600`}
                        value={amountStr}
                        onChange={(e) => setAmountStr(e.target.value)}
                        onBlur={handleAmountBlur}
                        onKeyDown={(e) => handleKeyDown(e, 'amountStr', e.currentTarget.value)}
                    />
                </div>
            </td>
            {/* Start Month */}
            <td className="px-4 py-3">
                <div className={`group/field flex items-center hover:bg-gray-100 ${type === 'income' ? 'focus-within:bg-green-50 focus-within:text-green-600' : 'focus-within:bg-red-50 focus-within:text-red-600'} rounded-md px-1 py-1 transition-colors cursor-text w-24 -ml-1`}>
                    <input
                        type="number"
                        min="1"
                        max="24"
                        className={`w-full bg-transparent border-none p-0 text-left focus:ring-0 font-medium text-gray-700 appearance-none ${type === 'income' ? 'group-focus-within/field:text-green-600' : 'group-focus-within/field:text-red-600'}`}
                        value={localData.startMonth}
                        // @ts-ignore
                        onChange={(e) => setLocalData({ ...localData, startMonth: parseInt(e.target.value) || 1 })}
                        onBlur={(e) => handleBlur('startMonth', parseInt(e.target.value) || 1)}
                        onKeyDown={(e) => handleKeyDown(e, 'startMonth', parseInt(e.currentTarget.value) || 1)}
                    />
                    <span className={`text-gray-400 text-xs ml-1 whitespace-nowrap ${type === 'income' ? 'group-focus-within/field:text-green-500' : 'group-focus-within/field:text-red-500'}`}>º mês</span>
                </div>
            </td>
            {/* Duration */}
            <td className="px-4 py-3">
                <div className={`group/field flex items-center hover:bg-gray-100 ${type === 'income' ? 'focus-within:bg-green-50 focus-within:text-green-600' : 'focus-within:bg-red-50 focus-within:text-red-600'} rounded-md px-1 py-1 transition-colors cursor-text w-24 -ml-1`}>
                    <input
                        type="number"
                        min="1"
                        max="60"
                        className={`w-full bg-transparent border-none p-0 text-left focus:ring-0 font-medium text-gray-700 appearance-none ${type === 'income' ? 'group-focus-within/field:text-green-600' : 'group-focus-within/field:text-red-600'}`}
                        value={localData.durationMonths}
                        // @ts-ignore
                        onChange={(e) => setLocalData({ ...localData, durationMonths: parseInt(e.target.value) || 1 })}
                        onBlur={(e) => handleBlur('durationMonths', parseInt(e.target.value) || 1)}
                        onKeyDown={(e) => handleKeyDown(e, 'durationMonths', parseInt(e.currentTarget.value) || 1)}
                    />
                    <span className={`text-gray-400 text-xs ml-1 whitespace-nowrap ${type === 'income' ? 'group-focus-within/field:text-green-500' : 'group-focus-within/field:text-red-500'}`}>meses</span>
                </div>
            </td>
            {/* Total (Read-only) */}
            <td className={`px-4 py-3 font-bold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(currentTotal, 'EUR')}
            </td>
            {/* Actions */}
            <td className="px-4 py-3 text-right">
                <button
                    onClick={onDelete}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Excluir"
                >
                    <LucideTrash2 size={16} />
                </button>
            </td>
        </tr>
    );
}
