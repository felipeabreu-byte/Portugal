import { getPostArrivalTasks } from "@/actions/post-arrival";
import { TasksClient } from "@/components/PostArrival/TasksClient";

export const dynamic = "force-dynamic";

export default async function PrimeirosPassosPage() {
    const tasks = await getPostArrivalTasks();

    const formattedTasks = tasks.map(t => ({
        id: t.id,
        timeframe: t.timeframe,
        title: t.title,
        status: t.status,
        notes: t.notes || "",
        completedAt: t.completedAt ? t.completedAt.toISOString() : null
    }));

    const byTimeframe = {
        "24H": formattedTasks.filter(t => t.timeframe === "24H"),
        "WEEK": formattedTasks.filter(t => t.timeframe === "WEEK"),
        "MONTH": formattedTasks.filter(t => t.timeframe === "MONTH")
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Primeiros Passos 📅</h2>
                <p className="text-gray-500 mt-1">
                    Acompanhe as tarefas essenciais organizadas por período após a chegada em Portugal.
                </p>
            </div>

            <TasksClient initialByTimeframe={byTimeframe} />
        </div>
    );
}
