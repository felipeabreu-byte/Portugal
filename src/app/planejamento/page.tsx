import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getExpenses, getIncomes } from "@/actions/planning";
import { ExpensePlanner } from "@/components/Planning/ExpensePlanner";

export const dynamic = "force-dynamic";

export default async function PlanningPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const expenses = await getExpenses();
    const incomes = await getIncomes();

    // Convert Decimals to numbers for client component
    const formattedExpenses = expenses.map(e => ({
        ...e,
        amountEur: Number(e.amountEur),
    }));

    const formattedIncomes = incomes.map(i => ({
        ...i,
        amountEur: Number(i.amountEur),
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Planejamento Financeiro</h2>
                    <p className="text-gray-500 mt-1">Simule e organize seus gastos e rendas nos primeiros meses em Portugal.</p>
                </div>
            </div>

            <ExpensePlanner initialExpenses={formattedExpenses} initialIncomes={formattedIncomes} />
        </div>
    );
}
