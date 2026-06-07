"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LucidePlaneTakeoff, Loader2, LucideX } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export function ArrivalButton() {
    const router = useRouter();
    const { confirmArrival } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [arrivalDateStr, setArrivalDateStr] = useState(new Date().toISOString().split('T')[0]);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await confirmArrival(new Date(arrivalDateStr));
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error confirming arrival:", error);
            alert("Erro ao registrar chegada. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
                <span>🇵🇹 Cheguei em Portugal</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-600 text-white flex justify-between items-center">
                            <h3 className="font-extrabold text-lg flex items-center gap-2">
                                <LucidePlaneTakeoff size={20} />
                                Confirmar Chegada
                            </h3>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <LucideX size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Tem certeza que deseja iniciar sua jornada pós-chegada? Algumas funcionalidades do sistema serão adaptadas para sua nova fase em Portugal.
                            </p>

                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Data de Chegada em Portugal
                                </label>
                                <input
                                    type="date"
                                    value={arrivalDateStr}
                                    onChange={(e) => setArrivalDateStr(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                disabled={isLoading}
                                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        Registrando...
                                    </>
                                ) : (
                                    "Confirmar Chegada"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
