import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const purchaseSchema = z.object({
    amountEur: z.number().positive(),
    exchangeRate: z.number().positive(),
    iof: z.number().min(0),
    totalBrl: z.number().positive(),
    type: z.enum(["CASH", "ACCOUNT"]),
    date: z.string(),
    notes: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const body = await req.json();
        const data = purchaseSchema.parse(body);

        const purchase = await prisma.purchase.create({
            data: {
                userId: user.id,
                amountEur: data.amountEur,
                exchangeRate: data.exchangeRate,
                iof: data.iof,
                totalBrl: data.totalBrl,
                type: data.type,
                date: new Date(data.date),
                notes: data.notes || null,
            },
        });

        return NextResponse.json(purchase, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao salvar compra" },
            { status: 500 }
        );
    }
}
