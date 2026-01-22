"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LucidePlus, LucideTrash2, LucideSave, LucideCalculator, LucideRotateCcw } from "lucide-react";
import { createExpense, deleteExpense, loadSuggestions, updateExpense } from "@/actions/planning";
import { ConfirmationModal } from "@/components/UI/ConfirmationModal";

interface Expense {
    id: string;
    description: string;
    amountEur: number;
    startMonth: number;
    durationMonths: number;
}

interface ExpensePlannerProps {
    initialExpenses: Expense[];
}

export function ExpensePlanner({ initialExpenses }: ExpensePlannerProps) {
    const router = useRouter();
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses.map(e => ({ ...e, amountEur: Number(e.amountEur) })));
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        setExpenses(initialExpenses.map(e => ({ ...e, amountEur: Number(e.amountEur) })));
    }, [initialExpenses]);

    const [loading, setLoading] = useState(false);

    // Quick Add State
    const [newDesc, setNewDesc] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [newStart, setNewStart] = useState("1");
    const [newDuration, setNewDuration] = useState("1");

    const handleAdd = async () => {
        if (!newDesc || !newAmount) return;
        setLoading(true);
        try {
            await createExpense({
                description: newDesc,
                amountEur: parseFloat(newAmount),
                startMonth: parseInt(newStart),
                durationMonths: parseInt(newDuration)
            });
            setNewDesc("");
            setNewAmount("");
            setNewStart("1");
            setNewDuration("1");
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        await deleteExpense(deleteId);
        setDeleteId(null);
        router.refresh();
    };

    const handleLoadSuggestions = async () => {
        setLoading(true);
        await loadSuggestions();
        setLoading(false);
        router.refresh();
    };

    const totalCost = expenses.reduce((acc, curr) => acc + (curr.amountEur * curr.durationMonths), 0);

    return (
        <div className="space-y-6">
            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Excluir Gasto"
                message="Tem certeza que deseja remover este item do seu planejamento? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                isDangerous
            />
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Seu Planejamento</h3>
                    <p className="text-sm text-gray-500">Adicione gastos previstos para os primeiros meses.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleLoadSuggestions}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                        <LucideRotateCcw size={16} />
                        Carregar Sugestões
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* List Column */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Add Form */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-semibold mb-3 text-sm uppercase text-gray-500 tracking-wider">Novo Gasto</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                            <div className="sm:col-span-4">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Descrição</label>
                                <input
                                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ex: Aluguel"
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Mensal (€)</label>
                                <input
                                    type="number"
                                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                    value={newAmount}
                                    onChange={e => setNewAmount(e.target.value)}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Início (Mês)</label>
                                <select
                                    className="w-full text-sm border-gray-200 rounded-lg"
                                    value={newStart}
                                    onChange={e => setNewStart(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(m => <option key={m} value={m}>{m}º</option>)}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Duração</label>
                                <select
                                    className="w-full text-sm border-gray-200 rounded-lg"
                                    value={newDuration}
                                    onChange={e => setNewDuration(e.target.value)}
                                >
                                    {[1, 3, 6, 12, 24].map(m => <option key={m} value={m}>{m} meses</option>)}
                                </select>
                            </div>
                            <div className="sm:col-span-1">
                                <button
                                    onClick={handleAdd}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    <LucidePlus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Descrição</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Valor Mensal</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Início</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Duração</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Total</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {expenses.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                            Nenhum gasto planejado. Adicione um novo ou carregue sugestões.
                                        </td>
                                    </tr>
                                )}
                                {expenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50 group">
                                        <td className="px-4 py-3 text-gray-800 font-medium">{expense.description}</td>
                                        <td className="px-4 py-3 text-gray-600">€ {Number(expense.amountEur).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-gray-600">{expense.startMonth}º Mês</td>
                                        <td className="px-4 py-3 text-gray-600">{expense.durationMonths} meses</td>
                                        <td className="px-4 py-3 text-blue-600 font-bold">€ {(expense.amountEur * expense.durationMonths).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(expense.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <LucideTrash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Column */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-xl sticky top-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <LucideCalculator size={24} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold">Previsão Total</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Custo Total Estimado</p>
                                <p className="text-4xl font-extrabold tracking-tight">
                                    € {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                                <p className="text-blue-100 text-xs mb-2">Dica Financeira</p>
                                <p className="text-sm font-medium leading-relaxed">
                                    Considere ter uma reserva de emergência de pelo menos <strong>20%</strong> acima deste valor para imprevistos na chegada.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
