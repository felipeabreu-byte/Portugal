'use server'

import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getChecklistCategories() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    // Ensure user exists (in case auth is out of sync)
    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Fetch categories with items for this user
    const categories = await prisma.checklistCategory.findMany({
        where: {
            title: {
                not: "Financeiro"
            }
        },
        include: {
            items: {
                where: { userId: user.id },
                orderBy: { createdAt: 'asc' }
            }
        },
        orderBy: { order: 'asc' }
    });

    return categories;
}

export async function addChecklistItem(categoryId: string, title: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM') {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error("User not found");

    await prisma.checklistItem.create({
        data: {
            title,
            priority,
            categoryId,
            userId: user.id,
        }
    });

    revalidatePath('/');
}

export async function toggleChecklistItem(itemId: string, currentStatus: 'PENDING' | 'COMPLETED' | 'NOT_APPLICABLE') {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    await prisma.checklistItem.update({
        where: { id: itemId },
        data: { status: newStatus }
    });

    revalidatePath('/');
}

export async function updateChecklistItem(itemId: string, data: { title?: string, priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', status?: 'PENDING' | 'COMPLETED' | 'NOT_APPLICABLE' }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.checklistItem.update({
        where: { id: itemId },
        data
    });

    revalidatePath('/');
}

export async function deleteChecklistItem(itemId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.checklistItem.delete({
        where: { id: itemId }
    });

    revalidatePath('/');
}
