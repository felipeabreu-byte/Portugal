'use client';

import { Suggestion } from "@/lib/suggestions";
import { Lightbulb, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SmartSuggestionsProps {
    suggestions: Suggestion[];
}

export function SmartSuggestions({ suggestions }: SmartSuggestionsProps) {
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const saved = localStorage.getItem('plano_portugal_dismissed_suggestions');
        if (saved) {
            setDismissedIds(new Set(JSON.parse(saved)));
        }
    }, []);

    const activeSuggestions = suggestions.filter(s => !dismissedIds.has(s.id));

    if (activeSuggestions.length === 0) return null;

    const dismissSuggestion = (id: string) => {
        setDismissedIds(prev => {
            const newSet = new Set(prev).add(id);
            localStorage.setItem('plano_portugal_dismissed_suggestions', JSON.stringify(Array.from(newSet)));
            return newSet;
        });
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {activeSuggestions.map((suggestion) => (
                <div
                    key={suggestion.id}
                    className={cn(
                        "relative p-4 rounded-xl border flex gap-3 shadow-sm hover:shadow-md transition-shadow group",
                        suggestion.type === 'WARNING' ? "bg-amber-50 border-amber-200" :
                            suggestion.type === 'ACTION' ? "bg-blue-50 border-blue-200" : "bg-white border-zinc-200"
                    )}
                >
                    <button
                        onClick={() => dismissSuggestion(suggestion.id)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-black/5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        title="Dispensar sugestão"
                    >
                        <X size={14} />
                    </button>

                    <div className={cn(
                        "mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        suggestion.type === 'WARNING' ? "bg-amber-100 text-amber-600" :
                            suggestion.type === 'ACTION' ? "bg-blue-100 text-blue-600" : "bg-zinc-100 text-zinc-500"
                    )}>
                        {suggestion.type === 'WARNING' ? <AlertCircle size={18} /> :
                            suggestion.type === 'ACTION' ? <Lightbulb size={18} /> : <Info size={18} />}
                    </div>
                    <div className="flex-1 pr-6">
                        <h4 className={cn("font-semibold text-sm mb-1",
                            suggestion.type === 'WARNING' ? "text-amber-900" :
                                suggestion.type === 'ACTION' ? "text-blue-900" : "text-zinc-900"
                        )}>
                            {suggestion.title}
                        </h4>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                            {suggestion.description}
                        </p>
                        {suggestion.actionLabel && (
                            <button className="mt-2 text-xs font-bold uppercase tracking-wide text-blue-600 hover:text-blue-700">
                                {suggestion.actionLabel} &rarr;
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
