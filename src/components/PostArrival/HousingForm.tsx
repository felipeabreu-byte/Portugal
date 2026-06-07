"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateHousingAction } from "@/actions/post-arrival";
import { LucideHome, Save, Loader2, LucideCalendar, LucideMapPin, LucideEuro, LucideHourglass } from "lucide-react";
import { HousingStatus } from "@prisma/client";
import clsx from "clsx";

interface HousingFormProps {
    initialData: {
        status: string;
        monthly: number | null;
        city: string;
        startDate: string;
        tempDays: number | null;
    };
}

export function HousingForm({ initialData }: HousingFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<HousingStatus>(initialData.status as HousingStatus);
    const [monthly, setMonthly] = useState(initialData.monthly !== null ? String(initialData.monthly) : "");
    const [city, setCity] = useState(initialData.city || "");
    const [startDate, setStartDate] = useState(initialData.startDate || "");
    const [tempDays, setTempDays] = useState(initialData.tempDays !== null ? String(initialData.tempDays) : "");
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    // Calculate remaining days for temporary accommodation
    let remainingDays: number | null = null;
    if (status === "TEMPORARY" && startDate && tempDays) {
        const parts = startDate.split('-');
        const start = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const limitTime = start.getTime() + parseInt(tempDays) * 24 * 60 * 60 * 1000;
        
        const localToday = new Date();
        const limitMidnightUtc = Date.UTC(new Date(limitTime).getFullYear(), new Date(limitTime).getMonth(), new Date(limitTime).getDate());
        const todayMidnightUtc = Date.UTC(localToday.getFullYear(), localToday.getMonth(), localToday.getDate());
        
        const diffTime = limitMidnightUtc - todayMidnightUtc;
        remainingDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            await updateHousingAction({
                status,
                monthly: monthly ? parseFloat(monthly) : null,
                city: city || null,
                startDate: startDate ? new Date(startDate) : null,
                tempDays: tempDays ? parseInt(tempDays) : null
            });
            setMessage({ text: "Informações de moradia salvas com sucesso!", type: "success" });
            router.refresh();
        } catch (error) {
            console.error("Error updating housing details:", error);
            setMessage({ text: "Ocorreu um erro ao salvar as alterações.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
            {message && (
                <div className={clsx(
                    "p-4 rounded-xl text-sm font-semibold border transition-all animate-in fade-in duration-200",
                    message.type === "success" 
                        ? "bg-green-50 text-green-700 border-green-100" 
                        : "bg-red-50 text-red-700 border-red-100"
                )}>
                    {message.text}
                </div>
            )}

            {/* Housing Status Selection Grid */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                {[
                    { key: "TEMPORARY", label: "Moradia Temporária", desc: "Alojamento local, hostel ou apartamento temporário", color: "border-amber-200 hover:border-amber-400 bg-amber-50/20 text-amber-600" },
                    { key: "SEARCHING", label: "Procura Ativa", desc: "Visitando imóveis e buscando fiador ou garantias", color: "border-blue-200 hover:border-blue-400 bg-blue-50/20 text-blue-600" },
                    { key: "DEFINITIVE", label: "Moradia Definitiva", desc: "Contrato assinado em imóvel definitivo", color: "border-green-200 hover:border-green-400 bg-green-50/20 text-green-600" }
                ].map((item) => {
                    const isSelected = status === item.key;
                    return (
                        <div
                            key={item.key}
                            onClick={() => setStatus(item.key as HousingStatus)}
                            className={clsx(
                                "border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-sm flex flex-col justify-between relative overflow-hidden",
                                isSelected 
                                    ? clsx("bg-white border-blue-600 scale-[1.02] ring-2 ring-blue-500/20") 
                                    : "bg-white border-gray-100 hover:scale-[1.01]"
                            )}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-sm font-bold text-gray-900">{item.label}</span>
                                <div className={clsx("p-1.5 rounded-lg border", isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-400 border-gray-100")}>
                                    <LucideHome size={16} />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    );
                })}
            </div>

            {/* Main Form Fields */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                    <LucideHome size={18} className="text-blue-600" />
                    Detalhes do Alojamento
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Cidade */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <LucideMapPin size={14} className="text-gray-400" />
                            Cidade
                        </label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Ex: Lisboa, Porto, Braga..."
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        />
                    </div>

                    {/* Valor Mensal */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <LucideEuro size={14} className="text-gray-400" />
                            Valor Mensal (€)
                        </label>
                        <input
                            type="number"
                            value={monthly}
                            onChange={(e) => setMonthly(e.target.value)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        />
                    </div>

                    {/* Data de Inicio */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <LucideCalendar size={14} className="text-gray-400" />
                            Data de Início
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        />
                    </div>

                    {/* Dias de Alojamento Temporario (only visible if TEMPORARY) */}
                    {status === "TEMPORARY" && (
                        <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <LucideHourglass size={14} className="text-gray-400" />
                                Dias de Alojamento Temporário
                            </label>
                            <input
                                type="number"
                                value={tempDays}
                                onChange={(e) => setTempDays(e.target.value)}
                                placeholder="Ex: 30"
                                min="1"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Temporary accommodation remaining days indicator */}
            {status === "TEMPORARY" && remainingDays !== null && (
                <div className={clsx(
                    "rounded-2xl p-5 border shadow-sm flex items-center gap-4 animate-in slide-in-from-top-2 duration-300",
                    remainingDays > 5 
                        ? "bg-blue-50 border-blue-100 text-blue-800" 
                        : remainingDays >= 0 
                            ? "bg-orange-50 border-orange-100 text-orange-800 animate-pulse-subtle" 
                            : "bg-red-50 border-red-100 text-red-800"
                )}>
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <LucideHourglass size={24} className={clsx(
                            remainingDays > 5 ? "text-blue-600" : remainingDays >= 0 ? "text-orange-600" : "text-red-600"
                        )} />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Status do Alojamento Temporário</span>
                        <p className="text-base font-bold">
                            {remainingDays > 0 
                                ? `Restam ${remainingDays} ${remainingDays === 1 ? 'dia' : 'dias'} de alojamento temporário.` 
                                : remainingDays === 0 
                                    ? "O prazo do seu alojamento temporário expira hoje!" 
                                    : `Prazo de alojamento temporário expirado há ${Math.abs(remainingDays)} ${Math.abs(remainingDays) === 1 ? 'dia' : 'dias'}.`}
                        </p>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
                >
                    {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Salvar Informações
                </button>
            </div>
        </form>
    );
}
