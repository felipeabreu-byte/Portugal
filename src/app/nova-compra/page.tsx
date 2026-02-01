"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewPurchasePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        amountEur: "",
        exchangeRate: "",
        iof: "1.1",
        type: "CASH",
        date: new Date().toISOString().split("T")[0],
        notes: "",
    });

    const [totalBrl, setTotalBrl] = useState<number | null>(null);

    useEffect(() => {
        const eur = parseFloat(formData.amountEur);
        const rate = parseFloat(formData.exchangeRate);
        const iof = parseFloat(formData.iof);

        if (!isNaN(eur) && !isNaN(rate) && !isNaN(iof)) {
            setTotalBrl(eur * rate * (1 + iof / 100));
        } else {
            setTotalBrl(null);
        }
    }, [formData.amountEur, formData.exchangeRate, formData.iof]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/purchases", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    amountEur: Number(formData.amountEur),
                    exchangeRate: Number(formData.exchangeRate),
                    iof: Number(formData.iof),
                    totalBrl: totalBrl
                }),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Erro ao salvar compra");

            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError("Ocorreu um erro ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Registrar Compra</h2>
                <p className="text-gray-500">Adicione uma nova compra de Euro</p>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valor em Euros (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={formData.amountEur}
                                onChange={(e) => setFormData({ ...formData, amountEur: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Taxa de Câmbio (R$)</label>
                            <input
                                type="number"
                                step="0.0001"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={formData.exchangeRate}
                                onChange={(e) => setFormData({ ...formData, exchangeRate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">IOF (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={formData.iof}
                                onChange={(e) => setFormData({ ...formData, iof: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="CASH">Espécie (Papel Moeda)</option>
                                <option value="ACCOUNT">Conta Global / Cartão</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data da Compra</label>
                        <input
                            type="date"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Observações (Opcional)</label>
                        <textarea
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-gray-700">Total em Reais (Estimado):</span>
                        <span className="text-xl font-bold text-gray-900">
                            {totalBrl !== null ? `R$ ${totalBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '---'}
                        </span>
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Salvar Compra"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
