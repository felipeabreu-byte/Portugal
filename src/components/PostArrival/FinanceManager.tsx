"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addFinanceItemAction, deleteFinanceItemAction } from "@/actions/post-arrival";
import { 
    LucidePlus, 
    LucideTrash2, 
    LucideCoins, 
    LucideTrendingUp, 
    LucideTrendingDown, 
    LucideWallet, 
    LucideHourglass, 
    Loader2 
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import clsx from "clsx";

interface FinanceItem {
    id: string;
    type: "INCOME" | "EXPENSE";
    category: string;
    description: string;
    amountEur: number;
    createdAt: string;
}

interface FinanceManagerProps {
    initialItems: FinanceItem[];
    reserveRemaining: number;
}

export function FinanceManager({ initialItems, reserveRemaining }: FinanceManagerProps) {
    const router = useRouter();
    const [items, setItems] = useState<FinanceItem[]>(initialItems);
    const [isLoading, setIsLoading] = useState(false);

    // Form inputs state
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
    const [category, setCategory] = useState("Aluguel");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    // Calculate indicators
    const incomes = items.filter(i => i.type === "INCOME");
    const expenses = items.filter(i => i.type === "EXPENSE");

    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amountEur, 0);
    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amountEur, 0);

    const netMonthly = totalIncome - totalExpense;
    const burnRate = netMonthly < 0 ? Math.abs(netMonthly) : 0;

    let autonomyMonths = 0;
    if (netMonthly >= 0) {
        autonomyMonths = Infinity;
    } else {
        autonomyMonths = burnRate > 0 ? (reserveRemaining / burnRate) : Infinity;
    }

    const categoriesMap: Record<"INCOME" | "EXPENSE", string[]> = {
        INCOME: ["Salário", "Freelance", "Outros"],
        EXPENSE: ["Aluguel", "Alimentação", "Transporte", "Telecomunicações", "Outros"]
    };

    const handleTypeChange = (newType: "INCOME" | "EXPENSE") => {
        setType(newType);
        setCategory(categoriesMap[newType][0]);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount) return;

        setIsLoading(true);
        try {
            const numAmount = parseFloat(amount);
            const newItem = await addFinanceItemAction({
                type,
                category,
                description,
                amountEur: numAmount
            });

            // Refresh local state and form
            setDescription("");
            setAmount("");
            router.refresh();
            // Since we can re-fetch or let router.refresh reload the server component, 
            // for immediate visual feedback we'll just push to local list or reload:
            window.location.reload(); // Simple reload ensures all dynamic values and server components are fully in sync!
        } catch (error) {
            console.error("Error adding finance item:", error);
            alert("Erro ao adicionar transação.");
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta transação?")) return;

        try {
            await deleteFinanceItemAction(id);
            setItems(prev => prev.filter(i => i.id !== id));
            router.refresh();
        } catch (error) {
            console.error("Error deleting finance item:", error);
            alert("Erro ao excluir transação.");
        }
    };

    return (
        <div className="space-y-6 w-full">
            {/* Indicators Grid */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                {/* Saldo Mensal */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fluxo Mensal</span>
                        <div className={clsx(
                            "p-1.5 rounded-lg",
                            netMonthly >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        )}>
                            {netMonthly >= 0 ? <LucideTrendingUp size={16} /> : <LucideTrendingDown size={16} />}
                        </div>
                    </div>
                    <div>
                        <p className={clsx(
                            "text-2xl font-bold",
                            netMonthly >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                            {netMonthly >= 0 ? "+" : ""}
                            {formatCurrency(netMonthly, "EUR")}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">Saldo receitas vs despesas</p>
                    </div>
                </div>

                {/* Gasto Medio Mensal */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Despesa Mensal</span>
                        <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                            <LucideTrendingDown size={16} />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpense, "EUR")}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Soma de todas as saídas</p>
                    </div>
                </div>

                {/* Reserva Restante */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reserva Acumulada</span>
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                            <LucideWallet size={16} />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(reserveRemaining, "EUR")}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Dinheiro trazido (compras de Euro)</p>
                    </div>
                </div>

                {/* Autonomia Financeira */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Autonomia Estimada</span>
                        <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                            <LucideHourglass size={16} />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-purple-700">
                            {netMonthly >= 0 
                                ? "Estável (Sobra)" 
                                : `${Math.round(autonomyMonths * 10) / 10} ${Math.round(autonomyMonths * 10) / 10 === 1 ? 'mês' : 'meses'}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">Tempo estimado de reserva</p>
                    </div>
                </div>
            </div>

            {/* Layout for adding transactions and listing transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form to Add Transaction */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4 self-start">
                    <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                        Registrar Transação 💰
                    </h3>

                    <form onSubmit={handleAdd} className="space-y-4 text-xs">
                        {/* INCOME / EXPENSE Toggle */}
                        <div className="flex bg-gray-50 rounded-xl p-1 gap-1 border border-gray-100">
                            <button
                                type="button"
                                onClick={() => handleTypeChange("EXPENSE")}
                                className={clsx(
                                    "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                                    type === "EXPENSE"
                                        ? "bg-red-600 text-white shadow-sm"
                                        : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                Despesa (-)
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange("INCOME")}
                                className={clsx(
                                    "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                                    type === "INCOME"
                                        ? "bg-green-600 text-white shadow-sm"
                                        : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                Receita (+)
                            </button>
                        </div>

                        {/* Categoria */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Categoria</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                            >
                                {categoriesMap[type].map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Descricao */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Descrição</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ex: Supermercado Continente, Salário Mensal..."
                                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                required
                            />
                        </div>

                        {/* Valor */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Valor Mensal (€)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                min="0.01"
                                step="0.01"
                                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                required
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={clsx(
                                "w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-white shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-200 disabled:opacity-50",
                                type === "EXPENSE" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                            )}
                        >
                            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <LucidePlus size={16} />}
                            Adicionar Transação
                        </button>
                    </form>
                </div>

                {/* List of Registered Items */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
                    <div className="overflow-x-auto">
                        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                            Histórico de Transações do Pós-Chegada
                        </h3>

                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-gray-500 font-bold">Descrição</th>
                                    <th className="px-4 py-2 text-gray-500 font-bold w-24">Categoria</th>
                                    <th className="px-4 py-2 text-gray-500 font-bold w-24 text-right">Valor</th>
                                    <th className="px-4 py-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                                            Nenhuma transação registrada no pós-chegada.
                                        </td>
                                    </tr>
                                )}
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold text-gray-800">{item.description}</td>
                                        <td className="px-4 py-3 text-gray-500">
                                            <span className="px-2 py-0.5 border rounded-lg bg-gray-50 text-[10px] font-medium">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className={clsx(
                                            "px-4 py-3 font-bold text-right",
                                            item.type === "INCOME" ? "text-green-600" : "text-red-600"
                                        )}>
                                            {item.type === "INCOME" ? "+" : "-"}
                                            {formatCurrency(item.amountEur, "EUR")}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                title="Excluir"
                                            >
                                                <LucideTrash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
