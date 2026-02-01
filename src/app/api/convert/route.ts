import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { convertCurrency, isValidCurrency } from "@/lib/currency-converter";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Não autorizado" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { amount, fromCurrency, toCurrency } = body;

        // Validate input
        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Valor inválido" },
                { status: 400 }
            );
        }

        if (!fromCurrency || !toCurrency) {
            return NextResponse.json(
                { error: "Moedas não especificadas" },
                { status: 400 }
            );
        }

        // Validate currencies
        if (!isValidCurrency(fromCurrency)) {
            return NextResponse.json(
                { error: `Moeda de origem inválida: ${fromCurrency}` },
                { status: 400 }
            );
        }

        if (!isValidCurrency(toCurrency)) {
            return NextResponse.json(
                { error: `Moeda de destino inválida: ${toCurrency}` },
                { status: 400 }
            );
        }

        // Perform conversion
        const result = await convertCurrency(
            Number(amount),
            fromCurrency,
            toCurrency
        );

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Currency conversion error:", error);
        return NextResponse.json(
            { error: error.message || "Erro ao converter moeda" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Não autorizado" },
                { status: 401 }
            );
        }

        // Get user's currency settings
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                currency: true,
                baseRate: true
            }
        });

        return NextResponse.json({
            currency: user?.currency || "EUR",
            baseRate: user?.baseRate ? Number(user.baseRate) : 6.60
        });
    } catch (error: any) {
        console.error("Error fetching conversion settings:", error);
        return NextResponse.json(
            { error: "Erro ao buscar configurações" },
            { status: 500 }
        );
    }
}
