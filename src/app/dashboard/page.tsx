import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LucideEuro, LucideTrendingUp, LucideTarget, LucideWallet, LucideCalculator } from "lucide-react";
import { redirect } from "next/navigation";
import { SummaryCard } from "@/components/SummaryCard";
import { LiveEuroAdvice } from "@/components/LiveEuroAdvice";
import { getChecklistCategories } from "@/actions/checklist";
import { ChecklistList } from "@/components/Checklist/ChecklistList";
import { GlobalChecklistProgress } from "@/components/Checklist/GlobalChecklistProgress";
import { generateSuggestions } from "@/lib/suggestions";
import { NotificationCenter } from "@/components/NotificationCenter";
import { TravelInfoCard } from "@/components/Dashboard/TravelInfoCard";
import { LogoutButton } from "@/components/LogoutButton";
import { formatCurrency } from "@/lib/utils";

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
            },
            postArrivalExpenses: true
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
    const postArrivalExpenses = user.postArrivalExpenses || [];

    const totalEur = purchases.reduce((acc: number, p: any) => acc + Number(p.amountEur), 0);
    const totalBrl = purchases.reduce((acc: number, p: any) => acc + Number(p.totalBrl), 0);
    const avgRate = totalEur > 0 ? totalBrl / totalEur : 0;

    const totalPlanned = postArrivalExpenses.reduce((acc: number, curr: any) => acc + (Number(curr.amountEur) * curr.durationMonths), 0);

    const targetAmount = Number(user.targetAmount);
    const remaining = Math.max(0, targetAmount - totalEur);
    const progress = targetAmount > 0 ? Math.min(100, (totalEur / targetAmount) * 100) : 0;

    // Generate Suggestions
    const allChecklistItems = checklistCategories.flatMap((c: any) => c.items);

    // Simplification for server side suggestion generation:
    const totalItems = allChecklistItems.length;
    const completedItems = allChecklistItems.filter((i: any) => i.status === 'COMPLETED').length;
    const checklistProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    const suggestions = generateSuggestions(allChecklistItems, checklistProgress, {
        travelDate: user.travelDate,
        city: user.city,
        profile: user.profile
    });

    // Live Rate is now fetched client-side to avoid Vercel IP blocks

    return (
        <div className="space-y-6">
            {/* Live Advice Card (Client Side) */}
            <div className="mb-2">
                <LiveEuroAdvice />
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        {user.name ? `Bem-vindo, ${user.name.split(' ')[0]}` : 'Dashboard'}
                    </h2>
                    {user.name && <p className="text-gray-500">Vamos planejar sua jornada!</p>}
                </div>
                <NotificationCenter suggestions={suggestions} />
            </div>

            <TravelInfoCard
                travelDate={user.travelDate}
                city={user.city}
                profile={user.profile}
            />

            {/* Travel Progress */}
            <GlobalChecklistProgress categories={checklistCategories} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    title="Total Acumulado"
                    icon={LucideEuro}
                    value={formatCurrency(totalEur)}
                    subtitle={`Investido: R$ ${totalBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
                <SummaryCard
                    title="Planejamento Pós-Chegada"
                    icon={LucideCalculator} // Using Calculator Icon
                    value={formatCurrency(totalPlanned)}
                    subtitle="Estimado para o início"
                />
                <SummaryCard
                    title="Meta"
                    icon={LucideTarget}
                    value={formatCurrency(targetAmount)}
                    subtitle={`Faltam ${formatCurrency(remaining)}`}
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
                    {totalItems > 0 && <ChecklistList categories={checklistCategories} readOnly={true} />}
                </div>
            </div>
        </div>
    );
}
