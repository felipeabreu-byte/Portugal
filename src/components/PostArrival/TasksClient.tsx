"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleTaskAction } from "@/actions/post-arrival";
import { LucideCheck, LucideCircle, LucideAlarmClock, LucideCalendar, LucideCalendarDays } from "lucide-react";
import clsx from "clsx";

interface Task {
    id: string;
    timeframe: string;
    title: string;
    status: string;
    notes: string;
    completedAt: string | null;
}

interface TasksClientProps {
    initialByTimeframe: Record<string, Task[]>;
}

export function TasksClient({ initialByTimeframe }: TasksClientProps) {
    const router = useRouter();
    const [tasks, setTasks] = useState(initialByTimeframe);
    const [activeTab, setActiveTab] = useState<"24H" | "WEEK" | "MONTH">("24H");
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const tabs = [
        { key: "24H", label: "Primeiras 24h", icon: LucideAlarmClock, color: "text-red-600 bg-red-50 border-red-200" },
        { key: "WEEK", label: "Primeira Semana", icon: LucideCalendar, color: "text-amber-600 bg-amber-50 border-amber-200" },
        { key: "MONTH", label: "Primeiro Mês", icon: LucideCalendarDays, color: "text-blue-600 bg-blue-50 border-blue-200" }
    ] as const;

    const handleToggle = async (task: Task) => {
        setLoadingId(task.id);
        try {
            await toggleTaskAction(task.id, task.status);
            setTasks(prev => {
                const newTasks = { ...prev };
                newTasks[task.timeframe] = newTasks[task.timeframe].map(t =>
                    t.id === task.id
                        ? { ...t, status: t.status === "COMPLETED" ? "PENDING" : "COMPLETED", completedAt: t.status === "PENDING" ? new Date().toISOString() : null }
                        : t
                );
                return newTasks;
            });
            router.refresh();
        } catch (error) {
            console.error("Error toggling task:", error);
        } finally {
            setLoadingId(null);
        }
    };

    const currentTasks = tasks[activeTab] || [];
    const completedCount = currentTasks.filter(t => t.status === "COMPLETED").length;
    const totalCount = currentTasks.length;
    const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const globalTotal = Object.values(tasks).flat().length;
    const globalCompleted = Object.values(tasks).flat().filter(t => t.status === "COMPLETED").length;
    const globalPercent = globalTotal > 0 ? Math.round((globalCompleted / globalTotal) * 100) : 0;

    return (
        <div className="space-y-6 w-full">
            {/* Global Progress Summary */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-bold">Progresso Geral</h3>
                        <p className="text-blue-200 text-xs mt-0.5">Etapas concluídas na sua jornada de adaptação</p>
                    </div>
                    <span className="text-3xl font-extrabold text-white">{globalPercent}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-white h-2.5 rounded-full transition-all duration-1000"
                        style={{ width: `${globalPercent}%` }}
                    />
                </div>
                <p className="text-blue-200 text-xs mt-2">{globalCompleted} de {globalTotal} tarefas concluídas</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-3">
                {tabs.map(({ key, label, icon: Icon, color }) => {
                    const tabTasks = tasks[key] || [];
                    const done = tabTasks.filter(t => t.status === "COMPLETED").length;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={clsx(
                                "flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 text-left shadow-sm",
                                activeTab === key
                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 shadow-md"
                                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow"
                            )}
                        >
                            <div className={clsx("p-2 rounded-lg border", activeTab === key ? color : "bg-gray-50 text-gray-400 border-gray-100")}>
                                <Icon size={16} />
                            </div>
                            <div>
                                <p className={clsx("text-sm font-bold", activeTab === key ? "text-blue-700" : "text-gray-700")}>{label}</p>
                                <p className="text-[11px] text-gray-500">{done}/{tabTasks.length} concluídas</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Tasks Panel */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Panel Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900">
                            {tabs.find(t => t.key === activeTab)?.label}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{completedCount} de {totalCount} tarefas concluídas</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${completionPercent}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-blue-700">{completionPercent}%</span>
                    </div>
                </div>

                {/* Task list */}
                <div className="divide-y divide-gray-50">
                    {currentTasks.length === 0 && (
                        <div className="px-6 py-10 text-center text-gray-400 text-sm">
                            Nenhuma tarefa encontrada para este período.
                        </div>
                    )}
                    {currentTasks.map((task) => {
                        const isLoading = loadingId === task.id;
                        const isCompleted = task.status === "COMPLETED";

                        return (
                            <div
                                key={task.id}
                                className={clsx(
                                    "px-6 py-4 flex items-center justify-between gap-4 group transition-colors duration-150",
                                    isCompleted ? "bg-green-50/30" : "hover:bg-gray-50/50"
                                )}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <button
                                        onClick={() => handleToggle(task)}
                                        disabled={isLoading}
                                        className={clsx(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
                                            isCompleted
                                                ? "bg-green-500 border-green-500 shadow-sm"
                                                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50",
                                            isLoading && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {isCompleted && <LucideCheck size={14} className="text-white" strokeWidth={3} />}
                                        {!isCompleted && !isLoading && (
                                            <LucideCircle size={10} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </button>

                                    <div>
                                        <p className={clsx(
                                            "text-sm font-semibold transition-all duration-200",
                                            isCompleted ? "line-through text-gray-400" : "text-gray-800"
                                        )}>
                                            {task.title}
                                        </p>
                                        {task.completedAt && (
                                            <p className="text-[10px] text-green-600 font-medium mt-0.5">
                                                Concluída em {new Date(task.completedAt).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={clsx(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                        isCompleted
                                            ? "text-green-700 bg-green-100 border-green-200"
                                            : "text-gray-500 bg-gray-50 border-gray-200"
                                    )}>
                                        {isCompleted ? "Concluída" : "Pendente"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
