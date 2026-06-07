"use client";

import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { UserProvider } from "@/contexts/UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <UserProvider>
                <CurrencyProvider>{children}</CurrencyProvider>
            </UserProvider>
        </SessionProvider>
    );
}
