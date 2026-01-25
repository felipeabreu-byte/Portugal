"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideLayoutDashboard, LucidePlusCircle, LucideSettings, LucideLogOut, LucideMenu, LucideX, LucidePrinter, LucidePlane, LucideCalculator, LucideCheckSquare } from "lucide-react";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import { CurrencySelector } from "./CurrencySelector";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: LucideLayoutDashboard },
        { name: "Impressão", href: "/dashboard/print", icon: LucidePrinter },
        { name: "Checklist", href: "/dashboard/checklist", icon: LucideCheckSquare },
        { name: "Minha Viagem", href: "/dashboard/trip", icon: LucidePlane },
        { name: "Nova Compra", href: "/dashboard/purchases/new", icon: LucidePlusCircle },
        { name: "Planejamento", href: "/dashboard/planning", icon: LucideCalculator },
        { name: "Configurações", href: "/dashboard/settings", icon: LucideSettings },
    ];

    return (
        <>
            <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50 px-4 h-16 flex items-center justify-between shadow-sm print:hidden">
                <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight">
                    ReStarta
                </h1>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-gray-600 hover:bg-gray-100/50 rounded-full transition-colors"
                >
                    {isOpen ? <LucideX className="text-blue-600" /> : <LucideMenu />}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden fixed inset-0 top-16 bg-white z-40 p-4 space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium transition-all active:scale-95",
                                    isActive
                                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                                )}
                            >
                                <Icon className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400")} />
                                {link.name}
                            </Link>
                        )
                    })}

                    <div className="px-4 py-2">
                        <CurrencySelector />
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center gap-3 px-4 py-4 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 mt-4 active:scale-95"
                    >
                        <LucideLogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div >
            )
            }
        </>
    );
}
