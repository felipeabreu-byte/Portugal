import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const purchaseSchema = z.object({
    amountEur: z.number().positive(),
    exchangeRate: z.number().positive(),
    iof: z.number().min(0),
    totalBrl: z.number().positive(),
    type: z.enum(["CASH", "ACCOUNT"]),
    date: z.string(),
    notes: z.string().optional().nullable(),
});

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = params.id;

        const purchase = await prisma.purchase.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!purchase) {
            return NextResponse.json({ message: "Purchase not found" }, { status: 404 });
        }

        if (purchase.user.email.toLowerCase().trim() !== session.user.email.toLowerCase().trim()) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({
            id: purchase.id,
            amountEur: Number(purchase.amountEur),
            exchangeRate: Number(purchase.exchangeRate),
            iof: Number(purchase.iof),
            totalBrl: Number(purchase.totalBrl),
            type: purchase.type,
            date: purchase.date,
            notes: purchase.notes,
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching purchase" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = params.id;

        // Verify ownership
        const purchase = await prisma.purchase.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!purchase) {
            return NextResponse.json({ message: "Purchase not found" }, { status: 404 });
        }

        if (purchase.user.email.toLowerCase().trim() !== session.user.email.toLowerCase().trim()) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const data = purchaseSchema.parse(body);

        const updated = await prisma.purchase.update({
            where: { id },
            data: {
                amountEur: data.amountEur,
                exchangeRate: data.exchangeRate,
                iof: data.iof,
                totalBrl: data.totalBrl,
                type: data.type,
                date: new Date(data.date),
                notes: data.notes || null,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Dados inválidos", errors: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "Error updating purchase" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = params.id;

        // Verify ownership
        const purchase = await prisma.purchase.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!purchase) {
            return NextResponse.json({ message: "Purchase not found" }, { status: 404 });
        }

        if (purchase.user.email.toLowerCase().trim() !== session.user.email.toLowerCase().trim()) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await prisma.purchase.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting purchase" },
            { status: 500 }
        );
    }
}
