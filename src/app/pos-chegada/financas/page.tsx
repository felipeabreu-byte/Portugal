import { getFinanceItems } from "@/actions/post-arrival";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FinanceManager } from "@/components/PostArrival/FinanceManager";

export const dynamic = "force-dynamic";

export default async function FinancasPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            purchases: true
        }
    });

    if (!user) redirect("/login");

    const financeItems = await getFinanceItems();

    // Calculate baseline reserve remaining (sum of amountEur in purchases)
    const reserveRemaining = user.purchases.reduce((acc, curr) => acc + Number(curr.amountEur), 0);

    const formattedItems = financeItems.map(item => ({
        id: item.id,
        type: item.type as "INCOME" | "EXPENSE",
        category: item.category,
        description: item.description,
        amountEur: Number(item.amountEur),
        createdAt: item.createdAt.toISOString()
    }));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Finanças Pós-Chegada 💰</h2>
                <p className="text-gray-500 mt-1">
                    Gerencie suas despesas e receitas reais e calcule sua autonomia financeira em Portugal.
                </p>
            </div>

            <FinanceManager 
                initialItems={formattedItems} 
                reserveRemaining={reserveRemaining} 
            />
        </div>
    );
}
