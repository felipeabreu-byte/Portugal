import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LucideEuro, LucideTrendingUp, LucideTarget, LucideWallet } from "lucide-react";
import { redirect } from "next/navigation";
import { TransactionList } from "@/components/TransactionList";
import { SummaryCard } from "@/components/SummaryCard";
import { EuroAdviceCard } from "@/components/EuroAdviceCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            purchases: {
                orderBy: { date: 'desc' },
            }
        }
    });

    if (!user) {
        return <div>Usuário não encontrado</div>;
    }

    const purchases = user.purchases;

    const totalEur = purchases.reduce((acc: number, p: any) => acc + Number(p.amountEur), 0);
    const totalBrl = purchases.reduce((acc: number, p: any) => acc + Number(p.totalBrl), 0);
    const avgRate = totalEur > 0 ? totalBrl / totalEur : 0;

    const targetAmount = Number(user.targetAmount);
    const remaining = Math.max(0, targetAmount - totalEur);
    const progress = targetAmount > 0 ? Math.min(100, (totalEur / targetAmount) * 100) : 0;

    // Fetch Live Euro Rate (Commercial)
    let liveRate = 0;
    try {
        console.log("Fetching Euro Rate...");
        const res = await fetch("https://economia.awesomeapi.com.br/last/EUR-BRLT", {
            cache: 'no-store',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const data = await res.json();
        console.log("Euro Data:", JSON.stringify(data));

        if (data.EURBRLT) {
            liveRate = Number(data.EURBRLT.ask);
            console.log("Live Rate:", liveRate);
        }
    } catch (e) {
        console.error("Error fetching euro rate", e);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
            </div>

            {/* Live Advice Card (Full Width on mobile, span 2 on desktop if needed) */}
            {liveRate > 0 && (
                <div className="mb-6">
                    <EuroAdviceCard currentRate={liveRate} />
                </div>
            )}

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
                    title="Progresso"
                    icon={LucideWallet}
                    value={`${progress.toFixed(1)}%`}
                    subtitle="da meta atingida"
                    progress={progress}
                />
            </div>

            {/* Lista de Transações Recentes */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-white">
                    <h3 className="text-lg font-medium text-gray-900">Histórico Recente</h3>
                </div>
                <div className="p-0">
                    <TransactionList purchases={purchases.map((p: any) => ({
                        id: p.id,
                        date: p.date,
                        amountEur: Number(p.amountEur),
                        exchangeRate: Number(p.exchangeRate),
                        totalBrl: Number(p.totalBrl),
                        type: p.type
                    }))} />
                </div>
            </div>
        </div>
    );
}
