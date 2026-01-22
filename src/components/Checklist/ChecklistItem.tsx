'use client';

import { useState } from 'react';
import { Check, Clock, Trash2, Paperclip, Pencil } from 'lucide-react';
import { toggleChecklistItem, deleteChecklistItem, updateChecklistItem } from '@/actions/checklist';
import { cn } from '@/lib/utils';
import { ChecklistItem as PrismaChecklistItem } from '@prisma/client';
import { ConfirmationModal } from '@/components/UI/ConfirmationModal';
import { EditModal } from '@/components/UI/EditModal';

interface ChecklistItemProps {
    item: PrismaChecklistItem;
    readOnly?: boolean;
}

export function ChecklistItem({ item, readOnly = false }: ChecklistItemProps) {
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        await toggleChecklistItem(item.id, item.status);
        setLoading(false);
    };

    const confirmDelete = async () => {
        await deleteChecklistItem(item.id);
    }

    const handleEditItem = async (newTitle: string) => {
        await updateChecklistItem(item.id, { title: newTitle });
    };

    const priorityColor = {
        LOW: 'bg-blue-100 text-blue-700',
        MEDIUM: 'bg-gray-100 text-gray-700',
        HIGH: 'bg-orange-100 text-orange-700',
        CRITICAL: 'bg-red-100 text-red-700',
    };

    return (
        <>
            <div className={cn(
                "group flex items-center justify-between p-3 mb-2 rounded-lg border transition-all duration-200",
                item.status === 'COMPLETED' ? "bg-green-50/50 border-green-200" : "bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-sm"
            )}>
                <div className="flex items-center gap-3 flex-1">
                    <button
                        onClick={handleToggle}
                        disabled={loading}
                        className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                            item.status === 'COMPLETED'
                                ? "bg-green-500 border-green-500"
                                : "border-zinc-300 hover:border-zinc-400"
                        )}
                    >
                        {item.status === 'COMPLETED' && <Check size={14} className="text-white" />}
                    </button>

                    <div className="flex flex-col">
                        <span className={cn(
                            "text-sm font-medium transition-all",
                            item.status === 'COMPLETED' ? "text-zinc-400 line-through" : "text-zinc-700"
                        )}>
                            {item.title}
                        </span>
                        {item.suggestedDate && (
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                                <Clock size={10} />
                                {new Date(item.suggestedDate).toLocaleDateString('pt-BR')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Priority Badge */}
                    {item.priority !== 'MEDIUM' && item.status !== 'COMPLETED' && (
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium uppercase", priorityColor[item.priority])}>
                            {item.priority}
                        </span>
                    )}

                    {/* Actions */}
                    {!readOnly && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <button className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-600">
                                <Paperclip size={14} />
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="p-1 hover:bg-blue-50 rounded text-zinc-400 hover:text-blue-500"
                            >
                                <Pencil size={14} />
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="p-1 hover:bg-red-50 rounded text-zinc-400 hover:text-red-500"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Excluir Item"
                message={`Tem certeza que deseja excluir "${item.title}"?`}
                confirmText="Excluir"
                isDangerous={true}
            />

            <EditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleEditItem}
                initialValue={item.title}
                title="Editar Item"
                label="Nome do Item"
            />
        </>
    );
}
