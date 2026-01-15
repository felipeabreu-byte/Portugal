"use client";

import { ChecklistGroup } from "./ChecklistGroup";
import { ChecklistCategory, ChecklistItem } from "@prisma/client";
import { useSidebar } from "@/contexts/SidebarContext";
import clsx from "clsx";

interface CategoryWithItems extends ChecklistCategory {
    items: ChecklistItem[];
}

interface ChecklistListProps {
    categories: CategoryWithItems[];
}

export function ChecklistList({ categories }: ChecklistListProps) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-zinc-800">Checklist de Viagem</h2>
            </div>

            <div className={clsx(
                "grid gap-4 transition-all duration-300 ease-in-out",
                "grid-cols-1 md:grid-cols-2",
                isCollapsed && "lg:grid-cols-3"
            )}>
                {categories.map((category) => (
                    <div key={category.id} className="h-full">
                        <ChecklistGroup category={category} />
                    </div>
                ))}
            </div>
        </div>
    );
}
