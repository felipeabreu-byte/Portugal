'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newValue: string) => void | Promise<void>;
    initialValue: string;
    title: string;
    label?: string;
    placeholder?: string;
}

export function EditModal({
    isOpen,
    onClose,
    onSave,
    initialValue,
    title,
    label = "Nome",
    placeholder = ""
}: EditModalProps) {
    const [value, setValue] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);

    // Reset value when modal opens
    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
        }
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;

        setIsLoading(true);
        try {
            await onSave(value);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl scale-100 animate-slide-up transform m-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            {label}
                        </label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholder}
                            className="w-full p-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-100 rounded-xl transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !value.trim()}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all text-sm",
                                (isLoading || !value.trim()) && "opacity-50 cursor-not-allowed shadow-none"
                            )}
                        >
                            {isLoading ? 'Salvando...' : (
                                <>
                                    <Save size={18} />
                                    Salvar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
