import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getChecklistCategories } from "@/actions/checklist";
import { PrintManager } from "@/components/Print/PrintManager";

export const dynamic = "force-dynamic";

export default async function PrintPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const normalizedEmail = session.user.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: {
            purchases: {
                orderBy: { date: 'desc' },
            }
        }
    });

    if (!user) {
        return <div>Usuário não encontrado</div>;
    }

    // Fetch Checklist Data
    const checklistCategories = await getChecklistCategories();

    // Calculate Totals
    const purchases = user.purchases;
    const totalEur = purchases.reduce((acc, p) => acc + Number(p.amountEur), 0);
    const totalBrl = purchases.reduce((acc, p) => acc + Number(p.totalBrl), 0);

    return (
        <PrintManager
            checklistCategories={checklistCategories}
            purchases={purchases}
            userSettings={{
                targetAmount: Number(user.targetAmount)
            }}
            totals={{
                totalEur,
                totalBrl
            }}
        />
    );
}
