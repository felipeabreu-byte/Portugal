"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LucideLayoutDashboard, 
    LucidePlusCircle, 
    LucideLogOut, 
    LucideSettings, 
    LucideChevronLeft, 
    LucideChevronRight, 
    LucidePrinter, 
    LucidePlane, 
    LucideCalculator, 
    LucideCheckSquare, 
    LucideCoins, 
    LucideGift, 
    LucideExternalLink,
    LucideHome,
    LucideFileText,
    LucideBriefcase,
    LucidePhone,
    LucideTrendingUp
} from "lucide-react";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import { useSidebar } from "@/contexts/SidebarContext";
import { useUser } from "@/contexts/UserContext";

const WISE_URL = process.env.NEXT_PUBLIC_WISE_URL || "https://wise.com";
const NOMAD_URL = process.env.NEXT_PUBLIC_NOMAD_URL || "https://nomadglobal.com";

export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const { phase } = useUser();

    const preArrivalLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LucideLayoutDashboard },
        { name: "Impressão", href: "/impressao", icon: LucidePrinter },
        { name: "Checklist", href: "/checklist", icon: LucideCheckSquare },
        { name: "Nova Compra", href: "/nova-compra", icon: LucidePlusCircle },
        { name: "Planejamento", href: "/planejamento", icon: LucideCalculator },
        { name: "Conversor", href: "/conversor", icon: LucideCoins },
        { name: "Configurações", href: "/configuracoes", icon: LucideSettings },
    ];

    const postArrivalLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LucideLayoutDashboard },
        { name: "Instalação", href: "/pos-chegada/instalacao", icon: LucideHome },
        { name: "Documentação", href: "/pos-chegada/documentacao", icon: LucideFileText },
        { name: "Finanças", href: "/pos-chegada/financas", icon: LucideCoins },
        { name: "Trabalho", href: "/pos-chegada/trabalho", icon: LucideBriefcase },
        { name: "Primeiros Passos", href: "/pos-chegada/primeiros-passos", icon: LucideCheckSquare },
        { name: "Serviços Úteis", href: "/pos-chegada/servicos-uteis", icon: LucidePhone },
        { name: "Evolução", href: "/pos-chegada/evolucao", icon: LucideTrendingUp },
    ];

    const links = phase === "POST_ARRIVAL" ? postArrivalLinks : preArrivalLinks;


    return (
        <div
            className={clsx(
                "flex flex-col bg-white border-r h-full fixed md:relative hidden md:flex transition-all duration-500 ease-in-out shadow-xl z-10 print:hidden",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            <div className="h-20 flex items-center justify-center border-b relative">
                <h1 className={clsx(
                    "font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 transition-all duration-500 overflow-hidden whitespace-nowrap tracking-tight",
                    isCollapsed ? "text-[0px] opacity-0 w-0" : "text-2xl opacity-100 px-4"
                )}>
                    ReStarta
                </h1>

                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-100 rounded-full p-1.5 shadow-md hover:bg-gray-50 hover:scale-110 transition-all duration-200 z-50 text-blue-600"
                >
                    {isCollapsed ? (
                        <LucideChevronRight className="w-4 h-4" />
                    ) : (
                        <LucideChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-3 pt-6">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden whitespace-nowrap group relative",
                                isActive
                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1",
                                isCollapsed && "justify-center px-0"
                            )}
                            title={isCollapsed ? link.name : ""}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-600 rounded-r-full" />
                            )}
                            <Icon className={clsx(
                                "w-5 h-5 min-w-[20px] transition-colors duration-300",
                                isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
                            )} />
                            <span className={clsx(
                                "transition-all duration-500",
                                isCollapsed ? "opacity-0 w-0 translate-x-10" : "opacity-100 translate-x-0"
                            )}>
                                {link.name}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            {/* Affiliate Widget */}
            <div className={clsx(
                "px-4 py-3 mx-4 mb-4 rounded-2xl bg-gray-50 border border-gray-100 transition-all duration-300 relative overflow-hidden group/widget",
                isCollapsed ? "opacity-0 h-0 p-0 m-0 overflow-hidden pointer-events-none" : "opacity-100"
            )}>
                <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1 rounded-lg bg-blue-50 text-blue-600">
                        <LucideGift className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[13px] font-bold text-gray-800">Contas Globais</span>
                </div>
                <p className="text-[12px] text-gray-500 mb-2 leading-relaxed">
                    Economize nas taxas abrindo sua conta pelos links parceiros.
                </p>
                <div className="flex flex-col gap-1.5">
                    <a
                        href={WISE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-2 py-1 rounded-lg bg-emerald-600 text-white text-[13px] hover:bg-emerald-700 transition-all shadow-sm"
                    >
                        <span>Wise (Taxa Zero)</span>
                        <LucideExternalLink className="w-3 h-3 text-yellow-400" />
                    </a>
                    <a
                        href={NOMAD_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-2 py-1 rounded-lg bg-black text-white text-[13px] hover:bg-gray-800 transition-all shadow-sm"
                    >
                        <span>Nomad (Cashback)</span>
                        <LucideExternalLink className="w-3 h-3 text-yellow-400" />
                    </a>
                </div>
            </div>

            {/* Collapsed Gift Icon with Popover Tooltip */}
            {isCollapsed && (
                <div className="relative group/tooltip flex justify-center pb-4">
                    <div className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl cursor-pointer transition-all hover:scale-110">
                        <LucideGift className="w-4 h-4" />
                    </div>
                    {/* Tooltip Content */}
                    <div className="absolute left-full ml-3 bottom-0 w-44 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-50 pointer-events-auto">
                        <p className="text-[12px] font-extrabold text-gray-800 mb-2 uppercase tracking-wide">Contas Globais</p>
                        <div className="flex flex-col gap-1.5">
                            <a
                                href={WISE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-2 py-1 rounded-lg bg-emerald-600 text-white text-[13px] hover:bg-emerald-700 transition-colors"
                            >
                                <span>Wise</span>
                                <LucideExternalLink className="w-3 h-3 text-yellow-400" />
                            </a>
                            <a
                                href={NOMAD_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-2 py-1 rounded-lg bg-black text-white text-[13px] hover:bg-gray-800 transition-colors"
                            >
                                <span>Nomad</span>
                                <LucideExternalLink className="w-3 h-3 text-yellow-400" />
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={clsx(
                        "flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 overflow-hidden whitespace-nowrap group",
                        isCollapsed && "justify-center px-0"
                    )}
                    title={isCollapsed ? "Sair" : ""}
                >
                    <LucideLogOut className="w-5 h-5 min-w-[20px] group-hover:scale-110 transition-transform duration-200" />
                    <span className={clsx(
                        "transition-all duration-500",
                        isCollapsed ? "opacity-0 w-0 translate-x-10" : "opacity-100 translate-x-0"
                    )}>
                        Sair
                    </span>
                </button>
            </div>
        </div>
    );
}
