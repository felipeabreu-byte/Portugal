"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
    const router = useRouter();
    const [targetAmount, setTargetAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch current goal
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => {
                if (data.targetAmount) setTargetAmount(data.targetAmount);
            })
            .finally(() => setFetching(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                body: JSON.stringify({ targetAmount: Number(targetAmount) }),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error();

            setMessage("Meta atualizada com sucesso!");
            router.refresh();
        } catch (err) {
            setMessage("Erro ao atualizar meta.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div>Carregando...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
                <p className="text-gray-500">Defina seus objetivos</p>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Meta em Euros (€)</label>
                        <p className="text-xs text-gray-500 mb-2">Quanto você pretende acumular?</p>
                        <input
                            type="number"
                            step="1"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                        />
                    </div>

                    {message && (
                        <div className={`text-sm ${message.includes("sucesso") ? "text-green-600" : "text-red-500"}`}>
                            {message}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Salvar Configurações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
