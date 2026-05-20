import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getChecklistCategories } from "@/actions/checklist";
import { ChecklistList } from "@/components/Checklist/ChecklistList";
import { prisma } from "@/lib/prisma";
import { TransactionList } from "@/components/TransactionList";
import Link from "next/link";
import { LucideWallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ChecklistPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const checklistCategories = await getChecklistCategories();

    const normalizedEmail = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: {
            purchases: {
                orderBy: { date: 'desc' },
            },
        }
    });

    if (!user) {
        redirect("/login");
    }

    // Convert Decimals to plain numbers for the Client Component
    const formattedPurchases = user.purchases.map((p: any) => ({
        ...p,
        amountEur: Number(p.amountEur),
        exchangeRate: Number(p.exchangeRate),
        totalBrl: Number(p.totalBrl),
    }));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Checklist de Mudança</h2>
                <p className="text-gray-500 mt-1">Gerencie todas as tarefas para sua mudança para Portugal.</p>
            </div>

            <ChecklistList categories={checklistCategories} />

            {/* Histórico de Compras de Euro */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        <LucideWallet className="text-blue-600 w-5 h-5" />
                        Histórico de Compras de Euro
                    </h3>
                    <Link
                        href="/nova-compra"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 duration-200"
                    >
                        + Registrar Compra
                    </Link>
                </div>
                <TransactionList purchases={formattedPurchases} />
            </div>
        </div>
    );
}

