"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getSortedCurrencies } from "@/lib/currencies";

export default function SettingsPage() {
    const router = useRouter();
    const [targetAmount, setTargetAmount] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [phone, setPhone] = useState("");
    const [currency, setCurrency] = useState("");
    const { setCurrency: setGlobalCurrency } = useCurrency();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => {
                if (data.targetAmount) setTargetAmount(data.targetAmount);
                if (data.name) setName(data.name);
                if (data.age) setAge(data.age);
                if (data.phone) setPhone(data.phone);
                if (data.currency) setCurrency(data.currency);
            })
            .catch(err => console.error("Error fetching settings:", err))
            .finally(() => setFetching(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                body: JSON.stringify({
                    targetAmount: Number(targetAmount),
                    name,
                    age,
                    phone,
                    currency
                }),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error();

            setGlobalCurrency(currency as any);
            setMessage("Configurações atualizadas com sucesso!");
            router.refresh(); // Refresh server overrides
        } catch (err) {
            console.error(err);
            setMessage("Erro ao atualizar configurações.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Configurações</h2>
                    <p className="text-gray-500 mt-1">Gerencie seus dados pessoais e objetivos financeiros.</p>
                </div>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors bg-white px-3 py-2 rounded-lg border shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar ao Dashboard
                </Link>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Profile Section */}
                    <div className="border-b border-gray-100 pb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            Dados do Perfil
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all p-2.5 border"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Como você gostaria de ser chamado?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all p-2.5 border"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="Ex: 30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                                <input
                                    type="tel"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all p-2.5 border"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Moeda Principal</label>
                                <p className="text-xs text-gray-500 mb-2">Sua moeda de origem para conversões</p>
                                <select
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all p-2.5 border"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    {getSortedCurrencies().map(c => (
                                        <option key={c.code} value={c.code}>
                                            {c.name} ({c.symbol})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Financial Goals Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Objetivo Financeiro</h3>
                        <div className="max-w-md">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta de Reserva (€)</label>
                            <p className="text-xs text-gray-500 mb-2">Valor total que você planeja levar para Portugal.</p>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 sm:text-sm">€</span>
                                </div>
                                <input
                                    type="number"
                                    step="1"
                                    required
                                    className="block w-full rounded-lg border-gray-300 pl-7 p-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 border transition-all"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-lg flex items-center gap-2 ${message.includes("sucesso") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                            {message.includes("sucesso") ? (
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                            ) : (
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                            )}
                            {message}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-all w-full md:w-auto"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
