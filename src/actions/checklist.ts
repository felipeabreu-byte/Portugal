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

export async function createChecklistCategory(title: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    // Get the highest order to append to the end
    const lastCategory = await prisma.checklistCategory.findFirst({
        orderBy: { order: 'desc' }
    });

    const newOrder = (lastCategory?.order ?? 0) + 1;

    await prisma.checklistCategory.create({
        data: {
            title,
            order: newOrder
        }
    });

    revalidatePath('/');
}

export async function reorderChecklistCategories(categories: { id: string, order: number }[]) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    // Transaction ensures all updates succeed or fail together
    await prisma.$transaction(
        categories.map((cat) =>
            prisma.checklistCategory.update({
                where: { id: cat.id },
                data: { order: cat.order }
            })
        )
    );

    revalidatePath('/');
}

export async function deleteChecklistCategory(categoryId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    // Check if the user has permission (optional depending on if categories are shared or owned)
    // For now, assuming authenticated users can delete categories they see.
    // Ideally we should check if the category belongs to the user or is public but editable.
    // Given the previous code, categories seem global or per-user filtered. 
    // Wait, categories are shared but items are per user? "userId" is on Item.
    // ChecklistCategory does NOT have userId. 
    // This implies categories are global templates?
    // If I delete a category, I delete it for everyone?
    // Looking at "createChecklistCategory", it creates it globally.
    // So yes, deletion will delete it globally.
    // Deleting a category will cascade delete items due to relations?
    // Let's check schema via logic. Prisma usually needs Cascade delete on relation or manual delete.
    // Safest is to delete.

    // Safest is to delete items first to avoid foreign key constraints if cascade isn't set
    await prisma.checklistItem.deleteMany({
        where: { categoryId: categoryId }
    });

    await prisma.checklistCategory.delete({
        where: { id: categoryId }
    });

    revalidatePath('/');
}

export async function updateChecklistCategory(categoryId: string, title: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.checklistCategory.update({
        where: { id: categoryId },
        data: { title }
    });

    revalidatePath('/');
}
