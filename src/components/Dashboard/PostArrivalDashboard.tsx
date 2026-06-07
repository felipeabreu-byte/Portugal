"use client";

import Link from "next/link";
import { 
    LucideHome, 
    LucideFileText, 
    LucideCoins, 
    LucideBriefcase, 
    LucideCheckSquare, 
    LucidePhone, 
    LucideTrendingUp,
    LucideTrophy,
    LucideArrowRight,
    LucidePlaneLanding,
    LucideShieldCheck,
    LucideTrendingDown
} from "lucide-react";
import clsx from "clsx";
import { formatCurrency } from "@/lib/utils";

interface PostArrivalDashboardProps {
    data: {
        daysInPortugal: number;
        docPercent: number;
        autonomyMonths: number;
        netMonthly: number;
        totalIncome: number;
        totalExpense: number;
        reserveRemaining: number;
        housingStatus: string;
        housingCity: string | null;
        housingMonthly: number;
        housingTempDays: number | null;
        stabilisationScore: number;
        stabilisationClass: string;
        achievements: {
            id: string;
            title: string;
            description: string;
            icon: string;
            completed: boolean;
        }[];
    };
    userName: string;
}

export function PostArrivalDashboard({ data, userName }: PostArrivalDashboardProps) {
    const housingStatusLabel = {
        TEMPORARY: "Temporária",
        SEARCHING: "Procurando",
        DEFINITIVE: "Definitiva"
    }[data.housingStatus as "TEMPORARY" | "SEARCHING" | "DEFINITIVE"] || "Não definida";

    const housingColor = {
        TEMPORARY: "text-amber-600 bg-amber-50 border-amber-200",
        SEARCHING: "text-blue-600 bg-blue-50 border-blue-200",
        DEFINITIVE: "text-green-600 bg-green-50 border-green-200"
    }[data.housingStatus as "TEMPORARY" | "SEARCHING" | "DEFINITIVE"] || "text-gray-600 bg-gray-50 border-gray-200";

    const statusColor = {
        "Recém-chegado": "text-red-700 bg-red-50 border-red-200",
        "Em adaptação": "text-amber-700 bg-amber-50 border-amber-200",
        "Estabelecido": "text-blue-700 bg-blue-50 border-blue-200",
        "Integrado": "text-green-700 bg-green-50 border-green-200"
    }[data.stabilisationClass] || "text-gray-700 bg-gray-50 border-gray-200";

    // Finance Autonomy text
    let autonomyText = "";
    if (data.netMonthly >= 0) {
        autonomyText = "Estável (Sobra)";
    } else if (data.autonomyMonths === Infinity) {
        autonomyText = "Estável";
    } else {
        const months = Math.round(data.autonomyMonths * 10) / 10;
        autonomyText = `${months} ${months === 1 ? 'mês' : 'meses'} est.`;
    }

    const shortcuts = [
        { name: "Instalação", desc: "Gerencie sua moradia", href: "/pos-chegada/instalacao", icon: LucideHome, color: "from-blue-500 to-indigo-500" },
        { name: "Documentação", desc: "Monitore seus registros", href: "/pos-chegada/documentacao", icon: LucideFileText, color: "from-teal-500 to-emerald-500" },
        { name: "Finanças", desc: "Controle receitas e despesas", href: "/pos-chegada/financas", icon: LucideCoins, color: "from-amber-500 to-orange-500" },
        { name: "Trabalho", desc: "Portais de vaga e dicas", href: "/pos-chegada/trabalho", icon: LucideBriefcase, color: "from-purple-500 to-pink-500" },
        { name: "Primeiros Passos", desc: "Checklist por período", href: "/pos-chegada/primeiros-passos", icon: LucideCheckSquare, color: "from-indigo-500 to-cyan-500" },
        { name: "Serviços Úteis", desc: "Links e telefones de emergência", href: "/pos-chegada/servicos-uteis", icon: LucidePhone, color: "from-red-500 to-rose-500" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    Bem-vindo a Portugal, {userName.split(' ')[0]}! 🇵🇹
                </h2>
                <p className="text-gray-500 mt-1">Sua nova jornada de vida e adaptação começou. Acompanhe seu progresso de estabilização abaixo.</p>
            </div>

            {/* Quick Cards Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                {/* Card 1: Dias em Portugal */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dias em Portugal</span>
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                            <LucidePlaneLanding size={16} />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{data.daysInPortugal} dias</p>
                        <p className="text-xs text-gray-500 mt-0.5">Desde a sua chegada</p>
                    </div>
                </div>

                {/* Card 2: Status Geral */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status Geral</span>
                        <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                            <LucideShieldCheck size={16} />
                        </div>
                    </div>
                    <div>
                        <span className={clsx("inline-block text-[11px] font-bold px-2 py-0.5 rounded border mb-1", statusColor)}>
                            {data.stabilisationClass}
                        </span>
                        <p className="text-xs text-gray-500">Nota: {data.stabilisationScore}/100</p>
                    </div>
                </div>

                {/* Card 3: Documentação */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Documentação</span>
                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                            <LucideFileText size={16} />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{data.docPercent}%</p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${data.docPercent}%` }} />
                        </div>
                    </div>
                </div>

                {/* Card 4: Finanças */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Finanças (Autonomia)</span>
                        <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                            <LucideCoins size={16} />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{autonomyText}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {data.netMonthly >= 0 
                                ? `Saldo: +${formatCurrency(data.netMonthly, 'EUR')}/mês` 
                                : `Déficit: ${formatCurrency(Math.abs(data.netMonthly), 'EUR')}/mês`}
                        </p>
                    </div>
                </div>

                {/* Card 5: Moradia */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Moradia</span>
                        <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                            <LucideHome size={16} />
                        </div>
                    </div>
                    <div>
                        <span className={clsx("inline-block text-[11px] font-bold px-2 py-0.5 rounded border mb-1", housingColor)}>
                            {housingStatusLabel}
                        </span>
                        <p className="text-xs text-gray-500 truncate">{data.housingCity || "Cidade não definida"}</p>
                    </div>
                </div>
            </div>

            {/* Stabilisation & Achievements Block */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Stabilisation Card */}
                <div className="xl:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-2.5 rounded-xl">
                                    <LucideTrendingUp size={24} className="text-blue-400 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Índice de Estabilização</h3>
                                    <p className="text-xs text-gray-400">Algoritmo dinâmico de adaptação</p>
                                </div>
                            </div>
                            <span className={clsx("text-xs font-extrabold px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm", {
                                "bg-red-500/20 text-red-300": data.stabilisationClass === "Recém-chegado",
                                "bg-amber-500/20 text-amber-300": data.stabilisationClass === "Em adaptação",
                                "bg-blue-500/20 text-blue-300": data.stabilisationClass === "Estabelecido",
                                "bg-green-500/20 text-green-300": data.stabilisationClass === "Integrado"
                            })}>
                                {data.stabilisationClass}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm font-semibold">
                                <span className="text-gray-300">Progresso Geral</span>
                                <span className="text-blue-400 text-lg">{data.stabilisationScore}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3.5 border border-white/5 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3.5 rounded-full transition-all duration-1000" 
                                    style={{ width: `${data.stabilisationScore}%` }} 
                                />
                            </div>
                        </div>

                        {/* Breakdown description */}
                        <p className="text-xs text-gray-300 leading-relaxed mb-6">
                            Seu índice calcula o nível de integração a partir de 4 critérios: 
                            <strong className="text-white"> Documentos</strong> (30%), 
                            <strong className="text-white"> Moradia</strong> (25%), 
                            <strong className="text-white"> Autonomia Financeira</strong> (25%) e 
                            <strong className="text-white"> Emprego</strong> (20%). 
                            Complete as pendências de cada módulo para aumentar sua estabilidade no país.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                            <span className="text-[10px] text-gray-400 block mb-1">Documentos</span>
                            <span className="text-sm font-bold text-white">{data.docPercent}%</span>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                            <span className="text-[10px] text-gray-400 block mb-1">Moradia</span>
                            <span className="text-sm font-bold text-white truncate block">{housingStatusLabel}</span>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                            <span className="text-[10px] text-gray-400 block mb-1">Autonomia</span>
                            <span className="text-sm font-bold text-white">{data.netMonthly >= 0 ? "Estável" : autonomyText}</span>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                            <span className="text-[10px] text-gray-400 block mb-1">Emprego</span>
                            <span className="text-sm font-bold text-white">{data.totalIncome > 0 ? "Ativo" : "Pendente"}</span>
                        </div>
                    </div>
                </div>

                {/* Achievements Card (Evolução Preview) */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                <LucideTrophy className="text-amber-500 w-5 h-5" />
                                Suas Conquistas
                            </h3>
                            <Link 
                                href="/pos-chegada/evolucao" 
                                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-0.5 hover:underline"
                            >
                                Ver Todas
                                <LucideArrowRight size={14} />
                            </Link>
                        </div>

                        {/* Visual grid of Achievements */}
                        <div className="grid grid-cols-4 gap-3">
                            {data.achievements.slice(0, 8).map((ach) => (
                                <div 
                                    key={ach.id} 
                                    className={clsx(
                                        "aspect-square rounded-xl flex items-center justify-center text-2xl border transition-all relative group/ach",
                                        ach.completed 
                                            ? "bg-amber-50 border-amber-200 shadow-sm hover:scale-105" 
                                            : "bg-gray-50 border-gray-100 opacity-40"
                                    )}
                                    title={`${ach.title}: ${ach.description}`}
                                >
                                    <span>{ach.icon}</span>
                                    {/* Tooltip on hover */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover/ach:block w-36 bg-gray-900 text-white text-[10px] p-2 rounded-lg z-50 text-center shadow-lg pointer-events-none">
                                        <span className="font-bold block">{ach.title}</span>
                                        <span className="text-gray-300 mt-0.5 block">{ach.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                        <span>Concluídas: {data.achievements.filter(a => a.completed).length} de 8</span>
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-amber-500 h-2 rounded-full" 
                                style={{ width: `${(data.achievements.filter(a => a.completed).length / 8) * 100}%` }} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Shortcuts Sections */}
            <div>
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    Módulos Pós-Chegada
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shortcuts.map((shortcut) => {
                        const Icon = shortcut.icon;
                        return (
                            <Link 
                                key={shortcut.name}
                                href={shortcut.href}
                                className="group bg-white rounded-xl border border-gray-200/60 p-5 hover:border-blue-500 hover:shadow-md transition-all duration-300 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={clsx("p-3 rounded-xl text-white bg-gradient-to-br transition-transform group-hover:scale-110 duration-200", shortcut.color)}>
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                                            {shortcut.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{shortcut.desc}</p>
                                    </div>
                                </div>
                                <LucideArrowRight className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={16} />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
