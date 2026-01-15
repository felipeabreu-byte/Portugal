import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LucideEuro, LucideTrendingUp, LucideTarget, LucideWallet } from "lucide-react";
import { redirect } from "next/navigation";
import { SummaryCard } from "@/components/SummaryCard";
import { LiveEuroAdvice } from "@/components/LiveEuroAdvice";
import { getChecklistCategories } from "@/actions/checklist";
import { ChecklistList } from "@/components/Checklist/ChecklistList";
import { GlobalChecklistProgress } from "@/components/Checklist/GlobalChecklistProgress";
import { generateSuggestions } from "@/lib/suggestions";
import { SmartSuggestions } from "@/components/Dashboard/SmartSuggestions";
import { NotificationManager } from "@/components/UI/NotificationManager";
import { LogoutButton } from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const normalizedEmail = session.user.email.toLowerCase().trim();
    console.log(`Dashboard looking up user: '${session.user.email}' -> normalized: '${normalizedEmail}'`);

    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: {
            purchases: {
                orderBy: { date: 'desc' },
            }
        }
    });

    if (!user) {
        console.error(`Dashboard: User not found for email '${normalizedEmail}'`);
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="text-xl font-semibold text-gray-800">Usuário não encontrado</div>
                <div className="text-gray-600 mt-2">Você está logado como: {session.user.email}</div>
                <div className="text-yellow-600 mt-1 text-sm">Este usuário não existe no banco de dados.</div>
                <LogoutButton />
            </div>
        );
    }

    // Fetch Checklist Data
    const checklistCategories = await getChecklistCategories();

    const purchases = user.purchases;

    const totalEur = purchases.reduce((acc: number, p: any) => acc + Number(p.amountEur), 0);
    const totalBrl = purchases.reduce((acc: number, p: any) => acc + Number(p.totalBrl), 0);
    const avgRate = totalEur > 0 ? totalBrl / totalEur : 0;

    const targetAmount = Number(user.targetAmount);
    const remaining = Math.max(0, targetAmount - totalEur);
    const progress = targetAmount > 0 ? Math.min(100, (totalEur / targetAmount) * 100) : 0;

    // Generate Suggestions
    const allChecklistItems = checklistCategories.flatMap((c: any) => c.items);

    // Simplification for server side suggestion generation:
    const totalItems = allChecklistItems.length;
    const completedItems = allChecklistItems.filter((i: any) => i.status === 'COMPLETED').length;
    const checklistProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    const suggestions = generateSuggestions(allChecklistItems, checklistProgress);

    // Live Rate is now fetched client-side to avoid Vercel IP blocks

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
            </div>

            <NotificationManager suggestions={suggestions} />

            {/* Suggestions */}
            <SmartSuggestions suggestions={suggestions} />

            {/* Travel Progress */}
            <GlobalChecklistProgress categories={checklistCategories} />

            {/* Live Advice Card (Client Side) */}
            <div className="mb-6">
                <LiveEuroAdvice />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    title="Total Acumulado"
                    icon={LucideEuro}
                    value={`€ ${totalEur.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    subtitle={`Investido: R$ ${totalBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
                <SummaryCard
                    title="Câmbio Médio"
                    icon={LucideTrendingUp}
                    value={`R$ ${avgRate.toLocaleString('pt-BR', { minimumFractionDigits: 3 })}`}
                    subtitle="Por Euro comprado"
                />
                <SummaryCard
                    title="Meta"
                    icon={LucideTarget}
                    value={`€ ${targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`}
                    subtitle={`Faltam € ${remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
                <SummaryCard
                    title="Progresso Financeiro"
                    icon={LucideWallet}
                    value={`${progress.toFixed(1)}%`}
                    subtitle="da meta atingida"
                    progress={progress}
                />
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Checklist Column */}
                <div className="w-full">
                    <ChecklistList categories={checklistCategories} />
                </div>
            </div>
        </div>
    );
}
