import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'EUR',
    }).format(value);
}

export function formatEuNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function parseEuNumber(value: string): number {
    // Remove thousands separator (dot) and replace decimal separator (comma) with dot
    const clean = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(clean) || 0;
}
