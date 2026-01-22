'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Trash2, Pencil } from 'lucide-react';
import { ChecklistItem } from './ChecklistItem';
import { cn } from '@/lib/utils';
import { addChecklistItem, deleteChecklistCategory, updateChecklistCategory } from '@/actions/checklist';
import { ChecklistCategory, ChecklistItem as PrismaChecklistItem } from '@prisma/client';
import { ConfirmationModal } from '@/components/UI/ConfirmationModal';
import { EditModal } from '@/components/UI/EditModal';

interface CategoryWithItems extends ChecklistCategory {
    items: PrismaChecklistItem[];
}

interface ChecklistGroupProps {
    category: CategoryWithItems;
    readOnly?: boolean;
}

export function ChecklistGroup({ category, readOnly = false }: ChecklistGroupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newItemTitle, setNewItemTitle] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const completedCount = category.items.filter(i => i.status === 'COMPLETED').length;
    const totalCount = category.items.filter(i => i.status !== 'NOT_APPLICABLE').length;
    const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemTitle.trim()) return;

        await addChecklistItem(category.id, newItemTitle, 'MEDIUM'); // Default to medium
        setNewItemTitle('');
        setIsAdding(false);
    };

    const confirmDeleteCategory = async () => {
        await deleteChecklistCategory(category.id);
    };

    const handleEditCategory = async (newTitle: string) => {
        await updateChecklistCategory(category.id, newTitle);
    };

    return (
        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden mb-4">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-zinc-50 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                        progress === 100 ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
                    )}>
                        {progress}%
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-zinc-900">{category.title}</h3>
                        <p className="text-xs text-zinc-500">{completedCount}/{totalCount} items concluídos</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!readOnly && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditModalOpen(true);
                                }}
                                className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                title="Editar lista"
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDeleteModalOpen(true);
                                }}
                                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Excluir lista"
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                    <ChevronDown
                        className={cn("text-zinc-400 transition-transform", isOpen && "rotate-180")}
                        size={20}
                    />
                </div>
            </div>

            <div className={cn(
                "transition-[max-height] duration-300 ease-in-out overflow-hidden bg-zinc-50/50",
                isOpen ? "max-h-[1000px]" : "max-h-0"
            )}>
                <div className="p-4 pt-2">
                    {category.items.map((item) => (
                        <ChecklistItem key={item.id} item={item} readOnly={readOnly} />
                    ))}

                    {!readOnly && (
                        isAdding ? (
                            <form onSubmit={handleAddItem} className="mt-2 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newItemTitle}
                                    onChange={(e) => setNewItemTitle(e.target.value)}
                                    placeholder="Novo item..."
                                    className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                                <div className="flex items-center gap-1">
                                    <button
                                        type="submit"
                                        className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700"
                                    >
                                        Adicionar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="px-3 py-2 bg-zinc-200 text-zinc-700 text-xs font-medium rounded-lg hover:bg-zinc-300"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="mt-2 text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 w-full"
                            >
                                <Plus size={16} />
                                Adicionar item
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteCategory}
                title="Excluir Lista"
                message={`Tem certeza que deseja excluir a lista "${category.title}"? Todos os itens dentro dela serão perdidos.`}
                confirmText="Sim, excluir"
                cancelText="Cancelar"
                isDangerous={true}
            />

            {/* Edit Modal */}
            <EditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleEditCategory}
                initialValue={category.title}
                title="Editar Lista"
                label="Nome da Lista"
            />
        </div>
    );
}
