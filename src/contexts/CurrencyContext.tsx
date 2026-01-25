"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

type CurrencyCode = string;

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
    refreshCurrency: () => Promise<void>;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [currency, setCurrencyState] = useState<CurrencyCode>("EUR");
    const [isLoading, setIsLoading] = useState(true);

    const refreshCurrency = async () => {
        if (!session?.user) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/settings");
            if (res.ok) {
                const data = await res.json();
                if (data.currency) {
                    setCurrencyState(data.currency as CurrencyCode);
                }
            }
        } catch (error) {
            console.error("Failed to fetch currency settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Optimistic update wrapper
    const setCurrency = (newCurrency: CurrencyCode) => {
        setCurrencyState(newCurrency);
    };

    useEffect(() => {
        refreshCurrency();
    }, [session]);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, refreshCurrency, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}
