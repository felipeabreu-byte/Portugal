"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { getUserPhaseAndArrival, confirmArrivalAction } from "@/actions/post-arrival";

interface UserContextType {
    phase: "PRE_ARRIVAL" | "POST_ARRIVAL";
    arrivalDate: string | null;
    isLoading: boolean;
    confirmArrival: (date: Date) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [phase, setPhase] = useState<"PRE_ARRIVAL" | "POST_ARRIVAL">("PRE_ARRIVAL");
    const [arrivalDate, setArrivalDate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        if (!session?.user) {
            setIsLoading(false);
            return;
        }

        try {
            const data = await getUserPhaseAndArrival();
            if (data) {
                setPhase(data.phase as "PRE_ARRIVAL" | "POST_ARRIVAL");
                setArrivalDate(data.arrivalDate ? new Date(data.arrivalDate).toISOString() : null);
            }
        } catch (error) {
            console.error("Failed to fetch user phase settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmArrival = async (date: Date) => {
        setIsLoading(true);
        try {
            await confirmArrivalAction(date);
            setPhase("POST_ARRIVAL");
            setArrivalDate(date.toISOString());
        } catch (error) {
            console.error("Error confirming arrival:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, [session]);

    return (
        <UserContext.Provider value={{ phase, arrivalDate, isLoading, confirmArrival, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
