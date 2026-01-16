'use client';

// import { cn } from "@/lib/utils"; // removed unused
import { ChecklistCategory, ChecklistItem } from "@prisma/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

interface CategoryWithItems extends ChecklistCategory {
    items: ChecklistItem[];
}

interface GlobalChecklistProgressProps {
    categories: CategoryWithItems[];
}

export function GlobalChecklistProgress({ categories }: GlobalChecklistProgressProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('plano_portugal_checklist_collapsed');
        if (saved) {
            setIsCollapsed(JSON.parse(saved));
        }
    }, []);

    const toggleCollapse = () => {
        setIsCollapsed(prev => {
            const newState = !prev;
            localStorage.setItem('plano_portugal_checklist_collapsed', JSON.stringify(newState));
            return newState;
        });
    };

    // Flatten items
    const allItems = categories.flatMap(c => c.items);

    if (allItems.length === 0) return null;

    // Calculate weighted progress
    // Weights: CRITICAL=5, HIGH=3, MEDIUM=1, LOW=1

    const relevantItems = allItems.filter(i => i.status !== 'NOT_APPLICABLE');

    if (relevantItems.length === 0) return null;

    const weights = {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3,
        CRITICAL: 5
    };

    let totalWeight = 0;
    let completedWeight = 0;

    relevantItems.forEach(item => {
        const w = weights[item.priority as keyof typeof weights] || 1;
        totalWeight += w;
        if (item.status === 'COMPLETED') {
            completedWeight += w;
        }
    });

    const percentage = totalWeight === 0 ? 0 : Math.round((completedWeight / totalWeight) * 100);

    let statusText = "No início";
    if (percentage > 25) statusText = "Em andamento";
    if (percentage > 75) statusText = "Quase pronto";
    if (percentage === 100) statusText = "Pronto para viajar";

    return (
        <div className="relative mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg transition-all duration-300">
                <button
                    onClick={toggleCollapse}
                    className="absolute top-4 right-4 p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </button>

                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h3 className="text-2xl font-bold">Progresso da Viagem</h3>
                        {!isCollapsed && <p className="text-blue-100 opacity-90">{statusText}</p>}
                    </div>
                    {!isCollapsed && (
                        <div className="text-4xl font-bold">
                            {percentage}%
                        </div>
                    )}
                </div>

                {!isCollapsed && (
                    <div className="w-full bg-blue-900/30 rounded-full h-3 mb-4">
                        <div
                            className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                )}

                {!isCollapsed && (
                    <div className="flex gap-4 text-sm text-blue-100 animate-fade-in">
                        <div className="flex items-center gap-1">
                            <span className="font-bold">{relevantItems.length}</span> tarefas ativas
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold">{relevantItems.filter(i => i.status === 'COMPLETED').length}</span> concluídas
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
