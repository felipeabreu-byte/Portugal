import { LucidePhone, LucideExternalLink, LucideHeart, LucideTrain, LucideCoins, LucideShield, LucideAlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

const categories = [
    {
        id: "saude",
        title: "Saúde",
        icon: LucideHeart,
        color: "text-red-600 bg-red-50 border-red-200",
        gradient: "from-red-500 to-rose-500",
        services: [
            { name: "SNS 24 (Saúde)", contact: "808 24 24 24", desc: "Linha de atendimento do Serviço Nacional de Saúde, disponível 24h.", url: "https://www.sns24.gov.pt" },
            { name: "Médico Online (SNS)", contact: "https://www.sns24.gov.pt", desc: "Consultas e triagem online pelo portal SNS." },
            { name: "INEM (Emergência)", contact: "112", desc: "Número de Emergência Médica. Use em situações de urgência/perigo de vida." },
        ]
    },
    {
        id: "transportes",
        title: "Transportes",
        icon: LucideTrain,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        gradient: "from-blue-500 to-cyan-500",
        services: [
            { name: "CP (Comboios de Portugal)", contact: "707 210 220", desc: "Informações e bilhetes de comboios nacionais.", url: "https://www.cp.pt" },
            { name: "Carris Metropolitana", contact: "https://www.carrismetropolitana.pt", desc: "Rede de autocarros na Grande Lisboa e Setúbal." },
            { name: "Andante (Porto)", contact: "https://www.linhandante.com", desc: "Cartão multi-modal para Metro, Autocarros e Comboios no Porto." },
        ]
    },
    {
        id: "financas",
        title: "Finanças & Bancos",
        icon: LucideCoins,
        color: "text-amber-600 bg-amber-50 border-amber-200",
        gradient: "from-amber-500 to-orange-500",
        services: [
            { name: "AT (Portal das Finanças)", contact: "217 206 707", desc: "Autoridade Tributária – NIF, IRS, faturas.", url: "https://www.portaldasfinancas.gov.pt" },
            { name: "MB WAY (Multibanco)", contact: "https://www.mbway.pt", desc: "App de pagamentos móveis integrada à rede Multibanco." },
            { name: "Banco de Portugal", contact: "213 130 000", desc: "Regulador do sistema bancário e financeiro português.", url: "https://www.bportugal.pt" },
        ]
    },
    {
        id: "seguranca_social",
        title: "Segurança Social",
        icon: LucideShield,
        color: "text-green-600 bg-green-50 border-green-200",
        gradient: "from-green-500 to-emerald-500",
        services: [
            { name: "Segurança Social Direta", contact: "300 502 502", desc: "Portal online para consultar NISS, subsidios e benefícios.", url: "https://app.seg-social.pt" },
            { name: "Serviço de Estrangeiros (AIMA)", contact: "808 202 653", desc: "Autoridade para imigração e vistos – autorização de residência.", url: "https://www.aima.gov.pt" },
            { name: "Junta de Freguesia", contact: "Ver local", desc: "Para emissão de comprovativo de morada e serviços de proximidade." },
        ]
    },
    {
        id: "emergencia",
        title: "Emergência",
        icon: LucideAlertTriangle,
        color: "text-orange-600 bg-orange-50 border-orange-200",
        gradient: "from-orange-500 to-red-500",
        services: [
            { name: "Número de Emergência Geral", contact: "112", desc: "Bombeiros, Polícia e INEM. Use somente em emergências reais." },
            { name: "PSP (Polícia de Segurança Pública)", contact: "213 473 000", desc: "Polícia urbana de Portugal (Lisboa e Porto).", url: "https://www.psp.pt" },
            { name: "Embaixada do Brasil em Lisboa", contact: "217 248 710", desc: "Apoio consular para cidadãos brasileiros em Portugal.", url: "https://www.portalconsular.itamaraty.gov.br" },
        ]
    }
];

export default function ServicosUteisPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Serviços Úteis 📞</h2>
                <p className="text-gray-500 mt-1">
                    Central rápida de referência para os serviços essenciais em Portugal.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            {/* Card Header */}
                            <div className={`bg-gradient-to-r ${cat.gradient} p-4 flex items-center gap-3`}>
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <Icon size={20} className="text-white" />
                                </div>
                                <h3 className="text-base font-extrabold text-white">{cat.title}</h3>
                            </div>

                            {/* Services list */}
                            <div className="divide-y divide-gray-50">
                                {cat.services.map((service, i) => (
                                    <div key={i} className="p-4 flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-900">{service.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{service.desc}</p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            {/* Phone / Contact badge */}
                                            {service.contact && !service.contact.startsWith("http") && (
                                                <a
                                                    href={`tel:${service.contact.replace(/\s/g, "")}`}
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-200 transition-colors whitespace-nowrap"
                                                >
                                                    <LucidePhone size={11} />
                                                    {service.contact}
                                                </a>
                                            )}

                                            {/* URL button */}
                                            {service.url && (
                                                <a
                                                    href={service.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-100 transition-colors whitespace-nowrap"
                                                >
                                                    <LucideExternalLink size={11} />
                                                    Ver Site
                                                </a>
                                            )}

                                            {/* If contact is a URL (no phone, just URL) */}
                                            {service.contact.startsWith("http") && !service.url && (
                                                <a
                                                    href={service.contact}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-100 transition-colors whitespace-nowrap"
                                                >
                                                    <LucideExternalLink size={11} />
                                                    Aceder
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
