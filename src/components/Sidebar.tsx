"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideLayoutDashboard, LucidePlusCircle, LucideLogOut, LucideSettings } from "lucide-react";
import { signOut } from "next-auth/react";
import clsx from "clsx";

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: LucideLayoutDashboard },
        { name: "Nova Compra", href: "/purchases/new", icon: LucidePlusCircle },
        { name: "Configurações", href: "/settings", icon: LucideSettings },
    ];

    return (
        <div className="flex flex-col w-64 bg-white border-r h-full fixed md:relative hidden md:flex">
            <div className="h-16 flex items-center justify-center border-b">
                <h1 className="text-xl font-bold text-blue-600">Euro Tracker</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
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
            </nav>
            <div className="p-4 border-t">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LucideLogOut className="w-5 h-5" />
                    Sair
                </button>
            </div>
        </div>
    );
}
