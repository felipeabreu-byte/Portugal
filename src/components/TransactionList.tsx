"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LucideTrash2, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Purchase = {
    id: string;
    date: Date | string;
    amountEur: number;
    exchangeRate: number;
    totalBrl: number;
    type: string;
};

export function TransactionList({ purchases }: { purchases: Purchase[] }) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta compra?")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/purchases/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Erro ao excluir");

            router.refresh();
        } catch (error) {
            alert("Erro ao excluir compra");
        } finally {
            setDeletingId(null);
        }
    };

    if (purchases.length === 0) {
        return <div className="p-6 text-center text-gray-500">Nenhuma compra registrada.</div>;
    }

    return (
        <div className="w-full">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-gray-50/50">
                            <th className="h-12 px-4 align-middle font-medium text-gray-500">Data</th>
                            <th className="h-12 px-4 align-middle font-medium text-gray-500">Valor (EUR)</th>
                            <th className="h-12 px-4 align-middle font-medium text-gray-500">Câmbio</th>
                            <th className="h-12 px-4 align-middle font-medium text-gray-500">Total (BRL)</th>
                            <th className="h-12 px-4 align-middle font-medium text-gray-500">Tipo</th>
                            <th className="h-12 px-4 align-middle font-medium text-gray-500 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {purchases.map((p) => (
                            <tr key={p.id} className="border-b transition-colors hover:bg-gray-50/50">
                                <td className="p-4 align-middle">{new Date(p.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</td>
                                <td className="p-4 align-middle font-medium">{formatCurrency(Number(p.amountEur))}</td>
                                <td className="p-4 align-middle">R$ {Number(p.exchangeRate).toLocaleString("pt-BR", { minimumFractionDigits: 3 })}</td>
                                <td className="p-4 align-middle">R$ {Number(p.totalBrl).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                                <td className="p-4 align-middle capitalize">{p.type === "CASH" ? "Espécie" : "Conta"}</td>
                                <td className="p-4 align-middle text-right">
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        disabled={deletingId === p.id}
                                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50 disabled:opacity-50"
                                    >
                                        {deletingId === p.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <LucideTrash2 className="h-4 w-4" />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Feed */}
            <div className="md:hidden space-y-4 p-4">
                {purchases.map((p) => (
                    <div key={p.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">{new Date(p.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-gray-900">
                                        {formatCurrency(Number(p.amountEur))}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                                        {p.type === "CASH" ? "Espécie" : "Conta"}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(p.id)}
                                disabled={deletingId === p.id}
                                className="text-red-500 hover:text-red-700 p-2 -mr-2"
                            >
                                {deletingId === p.id ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <LucideTrash2 className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                            <div>
                                <p className="text-gray-500 text-xs">Câmbio</p>
                                <p className="font-medium">R$ {Number(p.exchangeRate).toLocaleString("pt-BR", { minimumFractionDigits: 3 })}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-xs">Total investido</p>
                                <p className="font-medium">R$ {Number(p.totalBrl).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
