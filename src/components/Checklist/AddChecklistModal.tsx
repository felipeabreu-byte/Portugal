'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { createChecklistCategory } from '@/actions/checklist';
import { cn } from '@/lib/utils';

interface AddChecklistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddChecklistModal({ isOpen, onClose }: AddChecklistModalProps) {
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            await createChecklistCategory(title);
            setTitle('');
            onClose();
        } catch (error) {
            console.error("Error creating checklist:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-slide-up transform">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-zinc-800">Novo Checklist</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Nome da Lista
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Documentos, Roupas de Inverno..."
                            className="w-full p-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-100 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !title.trim()}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all",
                                (isLoading || !title.trim()) && "opacity-50 cursor-not-allowed shadow-none"
                            )}
                        >
                            {isLoading ? 'Criando...' : (
                                <>
                                    <Plus size={18} />
                                    Criar Lista
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
