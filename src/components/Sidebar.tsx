"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideLayoutDashboard, LucidePlusCircle, LucideLogOut, LucideSettings, LucideChevronLeft, LucideChevronRight, LucidePrinter, LucidePlane, LucideCalculator, LucideCheckSquare, LucideCoins } from "lucide-react";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import { useSidebar } from "@/contexts/SidebarContext";

export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: LucideLayoutDashboard },
        { name: "Impressão", href: "/impressao", icon: LucidePrinter },
        { name: "Checklist", href: "/checklist", icon: LucideCheckSquare },
        { name: "Minha Viagem", href: "/minha-viagem", icon: LucidePlane },
        { name: "Nova Compra", href: "/nova-compra", icon: LucidePlusCircle },
        { name: "Planejamento", href: "/planejamento", icon: LucideCalculator },
        { name: "Conversor", href: "/conversor", icon: LucideCoins },
        { name: "Configurações", href: "/configuracoes", icon: LucideSettings },
    ];


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
