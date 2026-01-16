'use client';

import { X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isDangerous = false
}: ConfirmationModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
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
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {isDangerous && (
                            <div className="p-2 bg-red-100 text-red-600 rounded-full">
                                <AlertTriangle size={20} />
                            </div>
                        )}
                        <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="text-zinc-600 mb-6 leading-relaxed">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={cn(
                            "px-6 py-2 text-white rounded-xl font-medium shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                            isDangerous
                                ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                                : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                        )}
                    >
                        {isLoading ? 'Processando...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
