"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
            Sair e Tentar Novamente
        </button>
    );
}
