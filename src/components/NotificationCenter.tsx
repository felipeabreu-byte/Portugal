'use client';

import { Suggestion } from "@/lib/suggestions";
import { Lightbulb, AlertCircle, Info, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface NotificationCenterProps {
    suggestions: Suggestion[];
}

export function NotificationCenter({ suggestions }: NotificationCenterProps) {
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('plano_portugal_dismissed_suggestions');
        if (saved) {
            setDismissedIds(new Set(JSON.parse(saved)));
        }

        // Close on click outside
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeSuggestions = suggestions.filter(s => !dismissedIds.has(s.id));

    const dismissSuggestion = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDismissedIds(prev => {
            const newSet = new Set(prev).add(id);
            localStorage.setItem('plano_portugal_dismissed_suggestions', JSON.stringify(Array.from(newSet)));
            return newSet;
        });
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Notificações"
            >
                <Bell className="h-6 w-6" />
                {activeSuggestions.length > 0 && (
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-[8px] text-white items-center justify-center font-bold">
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900">Notificações</h3>
                        <span className="text-xs text-gray-500">{activeSuggestions.length} novas</span>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto">
                        {activeSuggestions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <p className="text-sm">Nenhuma notificação nova.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {activeSuggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        className={cn(
                                            "p-4 hover:bg-gray-50 transition-colors relative group",
                                            suggestion.type === 'WARNING' ? "bg-amber-50/30" :
                                                suggestion.type === 'ACTION' ? "bg-blue-50/30" : ""
                                        )}
                                    >
                                        <div className="flex gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                                                suggestion.type === 'WARNING' ? "bg-amber-100 text-amber-600" :
                                                    suggestion.type === 'ACTION' ? "bg-blue-100 text-blue-600" : "bg-zinc-100 text-zinc-500"
                                            )}>
                                                {suggestion.type === 'WARNING' ? <AlertCircle size={16} /> :
                                                    suggestion.type === 'ACTION' ? <Lightbulb size={16} /> : <Info size={16} />}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm text-gray-900 leading-tight mb-1 pr-6">
                                                    {suggestion.title}
                                                </h4>
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    {suggestion.description}
                                                </p>
                                                {suggestion.actionLabel && (
                                                    suggestion.actionLink ? (
                                                        <Link
                                                            href={suggestion.actionLink}
                                                            onClick={() => setIsOpen(false)}
                                                            className="mt-2 inline-block text-xs font-bold uppercase tracking-wide text-blue-600 hover:text-blue-700"
                                                        >
                                                            {suggestion.actionLabel} &rarr;
                                                        </Link>
                                                    ) : (
                                                        <button className="mt-2 text-xs font-bold uppercase tracking-wide text-blue-600 hover:text-blue-700">
                                                            {suggestion.actionLabel} &rarr;
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => dismissSuggestion(suggestion.id, e)}
                                                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-black/5 rounded-full transition-colors"
                                                title="Dispensar"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
