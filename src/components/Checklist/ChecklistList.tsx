"use client";

import { ChecklistGroup } from "./ChecklistGroup";
import { ChecklistCategory, ChecklistItem } from "@prisma/client";
import { useSidebar } from "@/contexts/SidebarContext";
import clsx from "clsx";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { reorderChecklistCategories } from "@/actions/checklist";
import { Plus } from "lucide-react";
import { AddChecklistModal } from "./AddChecklistModal";

interface CategoryWithItems extends ChecklistCategory {
    items: ChecklistItem[];
}

interface ChecklistListProps {
    categories: CategoryWithItems[];
}

export function ChecklistList({ categories }: ChecklistListProps) {
    const { isCollapsed } = useSidebar();
    const [items, setItems] = useState(categories);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setItems(categories);
    }, [categories]);

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        // Optimistic update
        const newItems = Array.from(items);
        const [moved] = newItems.splice(sourceIndex, 1);
        newItems.splice(destinationIndex, 0, moved);

        setItems(newItems);

        // Server update
        // Map new order 
        const reorderedData = newItems.map((item, index) => ({
            id: item.id,
            order: index
        }));

        try {
            await reorderChecklistCategories(reorderedData);
        } catch (error) {
            console.error("Failed to reorder:", error);
            // Revert on failure
            setItems(categories);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-zinc-800">Checklist de Viagem</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm"
                >
                    <Plus size={16} />
                    Adicionar Lista
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="checklist-list" direction="vertical">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={clsx(
                                "grid gap-4 transition-all duration-300 ease-in-out",
                                "grid-cols-1 md:grid-cols-2",
                                isCollapsed && "lg:grid-cols-3"
                            )}
                        >
                            {items.map((category, index) => (
                                <Draggable key={category.id} draggableId={category.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={clsx(
                                                "h-full transition-transform",
                                                snapshot.isDragging && "opacity-75 scale-105 z-50"
                                            )}
                                            style={provided.draggableProps.style}
                                        >
                                            <ChecklistGroup category={category} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <AddChecklistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
