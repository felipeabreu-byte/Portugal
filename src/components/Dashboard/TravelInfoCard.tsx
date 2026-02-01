'use client';

import { LucideMapPin, LucideCalendar, LucideUser, LucideEdit2, LucidePlane, LucideTimer, LucideCloudSun, LucideLightbulb } from "lucide-react";
import Link from "next/link";
import { UserProfile } from "@prisma/client";

interface TravelInfoCardProps {
    travelDate: Date | null;
    city: string | null;
    profile: UserProfile | null;
}

export function TravelInfoCard({ travelDate, city, profile }: TravelInfoCardProps) {
    const hasData = travelDate || city;

    if (!hasData) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 border-dashed p-4 flex items-center justify-between shadow-sm mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full text-blue-500">
                        <LucidePlane size={20} />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm">Sua Viagem</h4>
                        <p className="text-xs text-gray-500">Configure os detalhes da sua viagem</p>
                    </div>
                </div>
                <Link
                    href="/dashboard/trip"
                    className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    Configurar
                </Link>
            </div>
        );
    }

    const calculatedDate = travelDate ? new Date(travelDate) : new Date();
    const formattedDate = travelDate ? calculatedDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Data não definida';

    // Helper: Days Remaining
    const today = new Date();
    const diffTime = calculatedDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let timeString = "";
    if (daysRemaining < 0) {
        timeString = "Viagem realizada";
    } else if (daysRemaining === 0) {
        timeString = "É hoje!";
    } else if (daysRemaining > 30) {
        const months = Math.floor(daysRemaining / 30);
        timeString = `Faltam ${months} meses`;
    } else {
        timeString = `Faltam ${daysRemaining} dias`;
    }

    // Helper: Season
    const month = calculatedDate.getMonth(); // 0-11
    // Portugal Season (Northern Hemisphere)
    // Dec(11), Jan(0), Feb(1) -> Winter
    // Mar(2), Apr(3), May(4) -> Spring
    // Jun(5), Jul(6), Aug(7) -> Summer
    // Sep(8), Oct(9), Nov(10) -> Autumn
    let season = "";
    let tip = "";

    if (month === 11 || month === 0 || month === 1) {
        season = "Inverno";
        tip = "Prepare roupas térmicas e guarda-chuva.";
    } else if (month >= 2 && month <= 4) {
        season = "Primavera";
        tip = "Clima ameno, ótimo para passeios ao ar livre.";
    } else if (month >= 5 && month <= 7) {
        season = "Verão";
        tip = "Protetor solar e roupas leves são essenciais.";
    } else {
        season = "Outono";
        tip = "Pode ventar bastante, traga um casaco corta-vento.";
    }

    return (
        <div className="bg-white/60 backdrop-blur-md rounded-xl border border-white/60 p-5 shadow-sm mb-6 relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <div className="text-blue-600">
                    <LucidePlane size={120} />
                </div>
            </div>

            <div className="flex flex-col gap-6 relative z-10">
                {/* Header Row: Main Trip Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/50 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/50 p-2.5 rounded-full text-blue-600 hidden sm:block shadow-sm">
                            <LucidePlane size={20} />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">

                            <div className="flex items-center gap-2">
                                <LucideCalendar size={14} className="text-gray-500" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Data</span>
                                    <span className="text-sm font-semibold text-gray-900">{formattedDate}</span>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-gray-200/50 hidden sm:block"></div>

                            <div className="flex items-center gap-2">
                                <LucideMapPin size={14} className="text-gray-500" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Destino</span>
                                    <span className="text-sm font-semibold text-gray-900">{city || 'Não definido'}</span>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-gray-200/50 hidden sm:block"></div>

                            <div className="flex items-center gap-2">
                                <LucideUser size={14} className="text-gray-500" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Perfil</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {profile === 'RESIDENT' ? 'Residente' : 'Turista'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/trip"
                        className="text-gray-500 hover:text-blue-600 hover:bg-white/50 p-2 rounded-full transition-all self-end sm:self-center"
                        title="Editar informações"
                    >
                        <LucideEdit2 size={16} />
                    </Link>
                </div>

                {/* Context Row: Countdown, Season, Tip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 bg-white/40 p-3 rounded-lg border border-white/50 shadow-sm">
                        <LucideTimer className="text-blue-500 mt-0.5" size={18} />
                        <div>
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-0.5">Contagem</span>
                            <span className="text-sm font-bold text-gray-900">{timeString}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/40 p-3 rounded-lg border border-white/50 shadow-sm">
                        <LucideCloudSun className="text-amber-500 mt-0.5" size={18} />
                        <div>
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-0.5">Estação em Portugal</span>
                            <span className="text-sm font-bold text-gray-900">{season}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100/50 shadow-sm">
                        <LucideLightbulb className="text-blue-500 mt-0.5" size={18} />
                        <div>
                            <span className="text-[10px] uppercase font-bold text-blue-600 transform scale-90 origin-left tracking-wider block mb-0.5">Dica da Estação</span>
                            <span className="text-xs font-medium text-blue-700 leading-relaxed">{tip}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
