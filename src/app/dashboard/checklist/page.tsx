import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getChecklistCategories } from "@/actions/checklist";
import { ChecklistList } from "@/components/Checklist/ChecklistList";

export const dynamic = "force-dynamic";

export default async function ChecklistPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const checklistCategories = await getChecklistCategories();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Checklist de Mudança</h2>
                <p className="text-gray-500 mt-1">Gerencie todas as tarefas para sua mudança para Portugal.</p>
            </div>

            <ChecklistList categories={checklistCategories} />
        </div>
    );
}
