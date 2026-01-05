"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideLayoutDashboard, LucidePlusCircle, LucideSettings, LucideLogOut, LucideMenu, LucideX } from "lucide-react";
import { signOut } from "next-auth/react";
import clsx from "clsx";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: LucideLayoutDashboard },
        { name: "Nova Compra", href: "/purchases/new", icon: LucidePlusCircle },
        { name: "Configurações", href: "/settings", icon: LucideSettings },
    ];

    return (
        <>
            <div className="md:hidden fixed top-0 w-full bg-white border-b z-50 px-4 h-16 flex items-center justify-between">
                <h1 className="text-xl font-bold text-blue-600">Euro Tracker</h1>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
                    {isOpen ? <LucideX /> : <LucideMenu />}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden fixed inset-0 top-16 bg-white z-40 p-4 space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    pathname === link.href
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        )
                    })}
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LucideLogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div>
            )}
        </>
    );
}
