"use client";

import { useState } from "react";
import { 
    LucideBriefcase, 
    LucideExternalLink, 
    LucideFileText, 
    LucideCheckCircle2, 
    LucideCalculator, 
    LucideCoins 
} from "lucide-react";
import clsx from "clsx";
import { formatCurrency } from "@/lib/utils";

export default function TrabalhoPage() {
    const [status, setStatus] = useState("SEARCHING"); // SEARCHING, EMPLOYED, FREELANCER
    const [cargo, setCargo] = useState("");
    const [empresa, setEmpresa] = useState("");
    const [grossSalary, setGrossSalary] = useState("");
    const [saved, setSaved] = useState(false);

    const portals = [
        { name: "Net-Empregos", url: "https://www.net-empregos.com", desc: "O maior portal de empregos de Portugal, com vagas em todas as áreas." },
        { name: "LinkedIn Portugal", url: "https://pt.linkedin.com", desc: "Rede profissional ideal para vagas qualificadas e corporativas." },
        { name: "IT Jobs", url: "https://www.itjobs.pt", desc: "O portal de referência para vagas de Tecnologia da Informação (TI)." },
        { name: "Indeed Portugal", url: "https://pt.indeed.com", desc: "Agregador de vagas nacional com busca por localização e cargo." }
    ];

    const cvTips = [
        { title: "Modelo Europass", desc: "O formato Europass é amplamente aceito e esperado por muitos recrutadores em Portugal." },
        { title: "Idioma Adequado", desc: "Prepare seu currículo em Português de Portugal (ex: 'Experiência profissional' ao invés de 'Histórico') e tenha uma versão em Inglês." },
        { title: "Informações Locais", desc: "Insira seu número de telefone português (+351), morada em Portugal e links profissionais como LinkedIn." }
    ];

    // Salary Calculator (simplified mock for Portugal)
    // SS = 11% employee contribution
    // IRS = simplified brackets based on average Single taxpayer
    const calculateNetSalary = () => {
        const gross = parseFloat(grossSalary);
        if (isNaN(gross) || gross <= 0) return 0;
        
        const socialSecurity = gross * 0.11;
        let irsRate = 0;
        
        if (gross <= 820) irsRate = 0;
        else if (gross <= 1000) irsRate = 0.08;
        else if (gross <= 1500) irsRate = 0.12;
        else if (gross <= 2500) irsRate = 0.18;
        else irsRate = 0.25;

        const irs = gross * irsRate;
        const net = gross - socialSecurity - irs;
        return {
            net,
            socialSecurity,
            irs,
            rate: Math.round(irsRate * 100)
        };
    };

    const calculation = calculateNetSalary();

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6 w-full">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Mercado de Trabalho 💼</h2>
                <p className="text-gray-500 mt-1">
                    Monitore sua situação profissional, busque vagas e simule descontos salariais em Portugal.
                </p>
            </div>

            {/* Employment Status Setup */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {/* Status Form */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4 self-start">
                    <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                        <LucideBriefcase size={18} className="text-blue-600" />
                        Situação Atual
                    </h3>

                    {saved && (
                        <div className="p-3 bg-green-50 text-green-700 border border-green-100 text-xs font-semibold rounded-xl animate-in fade-in duration-200">
                            Dados profissionais salvos com sucesso!
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Status Profissional</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                            >
                                <option value="SEARCHING">Procurando Emprego</option>
                                <option value="EMPLOYED">Empregado (Conta Outrem)</option>
                                <option value="FREELANCER">Trabalhador Independente</option>
                            </select>
                        </div>

                        {status !== "SEARCHING" && (
                            <div className="space-y-4 animate-in slide-in-from-top-1 duration-200">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Cargo / Função</label>
                                    <input
                                        type="text"
                                        value={cargo}
                                        onChange={(e) => setCargo(e.target.value)}
                                        placeholder="Ex: Engenheiro de Software, Gerente..."
                                        className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Empresa</label>
                                    <input
                                        type="text"
                                        value={empresa}
                                        onChange={(e) => setEmpresa(e.target.value)}
                                        placeholder="Ex: Teleperformance, Farfetch, Autônoma..."
                                        className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm transition-all"
                        >
                            Salvar Situação
                        </button>
                    </form>
                </div>

                {/* Portals and CV Checklist */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Portais de Vagas */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                            Portais de Emprego em Portugal 🇵🇹
                        </h3>
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                            {portals.map((portal) => (
                                <a 
                                    key={portal.name}
                                    href={portal.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group p-4 border border-gray-100 hover:border-blue-200 rounded-xl bg-gray-50/50 hover:bg-white transition-all shadow-sm flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between text-xs font-bold text-gray-900 group-hover:text-blue-600 mb-1">
                                            <span>{portal.name}</span>
                                            <LucideExternalLink size={12} className="text-gray-400 group-hover:text-blue-600" />
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">{portal.desc}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Dicas de Curriculo */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                            <LucideFileText size={18} className="text-blue-600" />
                            Dicas para Currículo Europeu
                        </h3>
                        <div className="space-y-3">
                            {cvTips.map((tip, i) => (
                                <div key={i} className="flex gap-3 text-xs leading-relaxed text-gray-600">
                                    <div className="mt-0.5 text-blue-500">
                                        <LucideCheckCircle2 size={14} />
                                    </div>
                                    <div>
                                        <strong className="text-gray-900 block mb-0.5">{tip.title}</strong>
                                        <p>{tip.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Salary Net Calculator */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4 w-full">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                    <LucideCalculator size={18} className="text-blue-600" />
                    Simulador de Salário Líquido (Estimado)
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                    Insira o salário bruto mensal para estimar o valor líquido aproximado a receber após os descontos de Segurança Social (11%) e IRS retido na fonte.
                </p>

                <div className="grid gap-6 md:grid-cols-2 pt-2">
                    <div className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Salário Bruto Mensal (€)</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500">€</span>
                                </div>
                                <input
                                    type="number"
                                    value={grossSalary}
                                    onChange={(e) => setGrossSalary(e.target.value)}
                                    placeholder="Ex: 1200"
                                    min="0"
                                    className="block w-full rounded-xl border-gray-200 pl-7 p-2 text-sm focus:border-blue-500 focus:ring-blue-500 border transition-all"
                                />
                            </div>
                        </div>

                        {calculation !== 0 && (
                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-2.5">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Segurança Social (11%):</span>
                                    <span className="font-bold text-red-600">-{formatCurrency(calculation.socialSecurity, "EUR")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">IRS Retido (Est. {calculation.rate}%):</span>
                                    <span className="font-bold text-red-600">-{formatCurrency(calculation.irs, "EUR")}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200/60 pt-2 text-sm">
                                    <span className="font-bold text-gray-900">Salário Líquido Estimado:</span>
                                    <span className="font-extrabold text-green-600">{formatCurrency(calculation.net, "EUR")}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50/50 rounded-xl border border-blue-100/50 p-4 text-xs text-blue-900 leading-relaxed self-start">
                        <strong className="text-blue-800 block mb-1">Nota Burocrática:</strong>
                        <p className="mb-2">
                            Os valores acima são aproximados e consideram um trabalhador solteiro, sem dependentes. Em Portugal, a retenção de IRS varia de acordo com seu agregado familiar.
                        </p>
                        <p>
                            Além disso, o salário mínimo nacional em Portugal em 2026 é de 870€ mensais (pago em 14 meses, correspondente a 1015€ mensais em regime de duodécimos).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
