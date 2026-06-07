'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { HousingStatus } from "@prisma/client";
import { calculateStabilisation, calculateAchievements } from "@/lib/post-arrival-utils";

// Get user phase and arrival date
export async function getUserPhaseAndArrival() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            phase: true,
            arrivalDate: true
        }
    });

    return user;
}

// Confirm Arrival action (Seeds default docs and tasks)
export async function confirmArrivalAction(arrivalDate: Date) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    // 1. Update User phase and arrival date
    await prisma.user.update({
        where: { id: user.id },
        data: {
            phase: "POST_ARRIVAL",
            arrivalDate: new Date(arrivalDate),
        }
    });

    // 2. Seed default documents if they don't exist
    const defaultDocs = [
        { type: 'NIF', status: 'NOT_STARTED' },
        { type: 'NISS', status: 'NOT_STARTED' },
        { type: 'UTENTE', status: 'NOT_STARTED' },
        { type: 'RESIDENCIA', status: 'NOT_STARTED' },
        { type: 'CONTA_BANCARIA', status: 'NOT_STARTED' },
        { type: 'COMPROVATIVO_MORADA', status: 'NOT_STARTED' }
    ];

    for (const doc of defaultDocs) {
        await prisma.postArrivalDoc.upsert({
            where: {
                userId_type: {
                    userId: user.id,
                    type: doc.type
                }
            },
            update: {},
            create: {
                userId: user.id,
                type: doc.type,
                status: doc.status
            }
        });
    }

    // 3. Seed default tasks if they don't exist
    const defaultTasks = [
        { timeframe: '24H', title: 'Comprar chip português' },
        { timeframe: '24H', title: 'Configurar internet' },
        { timeframe: '24H', title: 'Comprar cartão transporte' },
        { timeframe: '24H', title: 'Encontrar mercado próximo' },
        { timeframe: '24H', title: 'Registrar endereço temporário' },
        { timeframe: 'WEEK', title: 'Abrir conta bancária' },
        { timeframe: 'WEEK', title: 'Solicitar NISS' },
        { timeframe: 'WEEK', title: 'Atualizar morada' },
        { timeframe: 'WEEK', title: 'Organizar documentação' },
        { timeframe: 'WEEK', title: 'Criar currículo europeu' },
        { timeframe: 'MONTH', title: 'Encontrar moradia definitiva' },
        { timeframe: 'MONTH', title: 'Procurar emprego' },
        { timeframe: 'MONTH', title: 'Registrar-se em plataformas de emprego' },
        { timeframe: 'MONTH', title: 'Organizar orçamento mensal' },
        { timeframe: 'MONTH', title: 'Conhecer serviços públicos locais' }
    ];

    for (const task of defaultTasks) {
        await prisma.postArrivalTask.upsert({
            where: {
                userId_timeframe_title: {
                    userId: user.id,
                    timeframe: task.timeframe,
                    title: task.title
                }
            },
            update: {},
            create: {
                userId: user.id,
                timeframe: task.timeframe,
                title: task.title,
                status: 'PENDING'
            }
        });
    }

    revalidatePath("/dashboard");
    revalidatePath("/pos-chegada/instalacao");
    revalidatePath("/pos-chegada/documentacao");
    revalidatePath("/pos-chegada/financas");
    revalidatePath("/pos-chegada/primeiros-passos");
}

// Get documents
export async function getPostArrivalDocs() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            postArrivalDocs: {
                orderBy: { type: 'asc' }
            }
        }
    });

    return user?.postArrivalDocs || [];
}

// Update document details
export async function updateDocAction(id: string, data: { status?: string, emissionDate?: Date | null, notes?: string | null }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    await prisma.postArrivalDoc.update({
        where: { id },
        data: {
            status: data.status,
            emissionDate: data.emissionDate ? new Date(data.emissionDate) : data.emissionDate === null ? null : undefined,
            notes: data.notes
        }
    });

    revalidatePath("/dashboard");
    revalidatePath("/pos-chegada/documentacao");
    revalidatePath("/pos-chegada/evolucao");
}

// Get tasks
export async function getPostArrivalTasks() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            postArrivalTasks: true
        }
    });

    return user?.postArrivalTasks || [];
}

// Toggle task checkbox status
export async function toggleTaskAction(id: string, currentStatus: string, notes?: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    await prisma.postArrivalTask.update({
        where: { id },
        data: {
            status: newStatus,
            completedAt: newStatus === 'COMPLETED' ? new Date() : null,
            notes: notes !== undefined ? notes : undefined
        }
    });

    revalidatePath("/dashboard");
    revalidatePath("/pos-chegada/primeiros-passos");
}

// Get Housing details
export async function getHousingDetails() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            housingStatus: true,
            housingMonthly: true,
            housingCity: true,
            housingStartDate: true,
            housingTempDays: true
        }
    });

    return user;
}

// Update Housing details
export async function updateHousingAction(data: {
    status: HousingStatus;
    monthly?: number | null;
    city?: string | null;
    startDate?: Date | null;
    tempDays?: number | null;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    await prisma.user.update({
        where: { id: user.id },
        data: {
            housingStatus: data.status,
            housingMonthly: data.monthly !== undefined ? data.monthly : undefined,
            housingCity: data.city !== undefined ? data.city : undefined,
            housingStartDate: data.startDate !== undefined ? (data.startDate ? new Date(data.startDate) : null) : undefined,
            housingTempDays: data.tempDays !== undefined ? data.tempDays : undefined
        }
    });

    revalidatePath("/dashboard");
    revalidatePath("/pos-chegada/instalacao");
    revalidatePath("/pos-chegada/evolucao");
}

// Get Finance items
export async function getFinanceItems() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            postArrivalFinanceItems: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    return user?.postArrivalFinanceItems || [];
}

// Add Finance Item
export async function addFinanceItemAction(data: {
    type: 'INCOME' | 'EXPENSE';
    category: string;
    description: string;
    amountEur: number;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    await prisma.postArrivalFinanceItem.create({
        data: {
            userId: user.id,
            type: data.type,
            category: data.category,
            description: data.description,
            amountEur: data.amountEur
        }
    });

    revalidatePath("/dashboard");
    revalidatePath("/pos-chegada/financas");
    revalidatePath("/pos-chegada/evolucao");
}

// Delete Finance Item
export async function deleteFinanceItemAction(id: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    await prisma.postArrivalFinanceItem.delete({
        where: { id }
    });

    revalidatePath("/dashboard");
    revalidatePath("/pos-chegada/financas");
    revalidatePath("/pos-chegada/evolucao");
}

// Get Dashboard adaptation data
export async function getPostArrivalDashboardData() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            postArrivalDocs: true,
            postArrivalFinanceItems: true,
            purchases: true
        }
    });

    if (!user) throw new Error("User not found");

    // 1. Days in Portugal
    const today = new Date();
    const arrivalDate = user.arrivalDate ? new Date(user.arrivalDate) : new Date();
    const diffTime = today.getTime() - arrivalDate.getTime();
    const daysInPortugal = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    // 2. Documents Progress
    const totalDocs = user.postArrivalDocs.length || 6;
    const completedDocs = user.postArrivalDocs.filter(d => d.status === 'COMPLETED').length;
    const docPercent = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

    // 3. Finances Autonomy
    const incomes = user.postArrivalFinanceItems.filter(f => f.type === 'INCOME');
    const expenses = user.postArrivalFinanceItems.filter(f => f.type === 'EXPENSE');
    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.amountEur), 0);
    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amountEur), 0);
    const netMonthly = totalIncome - totalExpense;

    const preArrivalReserve = user.purchases.reduce((acc, curr) => acc + Number(curr.amountEur), 0);
    const reserveRemaining = preArrivalReserve; // Display this as the starting reserve amount

    let autonomyMonths = 0;
    if (netMonthly >= 0) {
        autonomyMonths = Infinity;
    } else {
        const burnRate = Math.abs(netMonthly);
        autonomyMonths = burnRate > 0 ? (reserveRemaining / burnRate) : Infinity;
    }

    // 4. Employment Check
    const hasEmployment = user.postArrivalFinanceItems.some(f => f.type === 'INCOME' && (f.category === 'Salário' || f.category === 'Freelance'));

    // 5. Stabilisation
    const { score, classification } = calculateStabilisation(user.postArrivalDocs, user.housingStatus, autonomyMonths, hasEmployment);

    // 6. Achievements
    const achievements = calculateAchievements(user.postArrivalDocs, user.housingStatus, user.postArrivalFinanceItems, daysInPortugal);

    return {
        daysInPortugal,
        docPercent,
        autonomyMonths,
        netMonthly,
        totalIncome,
        totalExpense,
        reserveRemaining,
        housingStatus: user.housingStatus,
        housingCity: user.housingCity,
        housingMonthly: user.housingMonthly ? Number(user.housingMonthly) : 0,
        housingTempDays: user.housingTempDays,
        stabilisationScore: score,
        stabilisationClass: classification,
        achievements
    };
}
