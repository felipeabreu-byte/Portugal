"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getExpenses() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { postArrivalExpenses: { orderBy: { createdAt: 'asc' } } }
    });

    return user?.postArrivalExpenses || [];
}

export async function createExpense(data: { description: string; amountEur: number; startMonth: number; durationMonths: number }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error("User not found");

    await prisma.postArrivalExpense.create({
        data: {
            userId: user.id,
            description: data.description,
            amountEur: data.amountEur,
            startMonth: data.startMonth,
            durationMonths: data.durationMonths,
        }
    });
    revalidatePath("/dashboard/planning");
}

export async function updateExpense(id: string, data: { description: string; amountEur: number; startMonth: number; durationMonths: number }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    await prisma.postArrivalExpense.update({
        where: { id },
        data: {
            description: data.description,
            amountEur: data.amountEur,
            startMonth: data.startMonth,
            durationMonths: data.durationMonths,
        }
    });
    revalidatePath("/dashboard/planning");
}

export async function deleteExpense(id: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    await prisma.postArrivalExpense.delete({ where: { id } });
    revalidatePath("/dashboard/planning");
}

export async function getIncomes() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { postArrivalIncomes: { orderBy: { createdAt: 'asc' } } }
    });

    return user?.postArrivalIncomes || [];
}

export async function createIncome(data: { description: string; amountEur: number; startMonth: number; durationMonths: number }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error("User not found");

    await prisma.postArrivalIncome.create({
        data: {
            userId: user.id,
            description: data.description,
            amountEur: data.amountEur,
            startMonth: data.startMonth,
            durationMonths: data.durationMonths,
        }
    });
    revalidatePath("/dashboard/planning");
}

export async function updateIncome(id: string, data: { description: string; amountEur: number; startMonth: number; durationMonths: number }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    await prisma.postArrivalIncome.update({
        where: { id },
        data: {
            description: data.description,
            amountEur: data.amountEur,
            startMonth: data.startMonth,
            durationMonths: data.durationMonths,
        }
    });
    revalidatePath("/dashboard/planning");
}

export async function deleteIncome(id: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    await prisma.postArrivalIncome.delete({ where: { id } });
    revalidatePath("/dashboard/planning");
}

export async function loadSuggestions() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error("User not found");

    const suggestions = [
        { description: "Alojamento Temporário (Airbnb/Hotel)", amountEur: 800, startMonth: 1, durationMonths: 1 },
        { description: "Renda (Aluguel + Caução)", amountEur: 1600, startMonth: 2, durationMonths: 1 },
        { description: "Renda (Mensal)", amountEur: 800, startMonth: 3, durationMonths: 10 },
        { description: "Alimentação (Mercado)", amountEur: 300, startMonth: 1, durationMonths: 12 },
        { description: "Transporte (Passe Navegante)", amountEur: 40, startMonth: 1, durationMonths: 12 },
        { description: "Telemóvel + Internet", amountEur: 25, startMonth: 1, durationMonths: 12 },
        { description: "Taxas Iniciais (NIF/NISS/Outros)", amountEur: 50, startMonth: 1, durationMonths: 1 },
    ];

    await prisma.postArrivalExpense.createMany({
        data: suggestions.map(s => ({ ...s, userId: user.id }))
    });

    revalidatePath("/dashboard/planning");
}
