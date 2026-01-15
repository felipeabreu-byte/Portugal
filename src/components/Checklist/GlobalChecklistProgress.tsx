'use client';

// import { cn } from "@/lib/utils"; // removed unused
import { ChecklistCategory, ChecklistItem } from "@prisma/client";
import { X } from "lucide-react";
import { useState } from "react";

interface CategoryWithItems extends ChecklistCategory {
    items: ChecklistItem[];
}

interface GlobalChecklistProgressProps {
    categories: CategoryWithItems[];
}

export function GlobalChecklistProgress({ categories }: GlobalChecklistProgressProps) {
    const [isVisible, setIsVisible] = useState(true);

    // Flatten items
    const allItems = categories.flatMap(c => c.items);

    if (allItems.length === 0 || !isVisible) return null;

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
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={18} />
                </button>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-2xl font-bold">Progresso da Viagem</h3>
                        <p className="text-blue-100 opacity-90">{statusText}</p>
                    </div>
                    <div className="text-4xl font-bold">
                        {percentage}%
                    </div>
                </div>

                <div className="w-full bg-blue-900/30 rounded-full h-3">
                    <div
                        className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="mt-4 flex gap-4 text-sm text-blue-100">
                    <div className="flex items-center gap-1">
                        <span className="font-bold">{relevantItems.length}</span> tarefas ativas
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-bold">{relevantItems.filter(i => i.status === 'COMPLETED').length}</span> concluídas
                    </div>
                </div>
            </div>
        </div>
    );
}
