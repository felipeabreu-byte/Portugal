'use client';

import { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Suggestion } from '@/lib/suggestions';

// Passively receives suggestions or checks local state to show notifications
interface NotificationManagerProps {
    suggestions: Suggestion[];
}

export function NotificationManager({ suggestions }: NotificationManagerProps) {
    const [activeNotification, setActiveNotification] = useState<Suggestion | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const playNotificationSound = async () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();

            // Explicitly resume context if suspended (Autoplay Policy resolution)
            if (ctx.state === 'suspended') {
                await ctx.resume();
            }

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            // 660Hz (E5) is a pleasant, clear alert tone
            oscillator.frequency.setValueAtTime(160, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.1);
            // Smoother envelope
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.5);
        } catch (error) {
            console.error("Error playing notification sound:", error);
        }
    };

    useEffect(() => {
        // Logic to pick a notification to show.
        // For now, let's show the first WARNING or ACTION notification after 2 seconds
        const target = suggestions.find(s => s.type === 'WARNING' || s.type === 'ACTION');

        if (target) {
            const timer = setTimeout(() => {
                setActiveNotification(target);
                setIsVisible(true);
                playNotificationSound();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [suggestions]);

    if (!activeNotification || !isVisible) return null;

    return (
        <div className={cn(
            "fixed bottom-4 right-4 max-w-sm bg-white rounded-xl shadow-2xl border border-zinc-100 p-4 transition-all duration-500 transform z-50",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}>
            <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <Bell size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm text-zinc-900">{activeNotification.title}</h4>
                    <p className="text-xs text-zinc-600 mt-1">{activeNotification.description}</p>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-xs font-medium text-zinc-500 hover:text-zinc-700"
                        >
                            Agora não
                        </button>
                        {activeNotification.actionLabel && (
                            <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
                                {activeNotification.actionLabel}
                            </button>
                        )}
                    </div>
                </div>
                <button onClick={() => setIsVisible(false)} className="text-zinc-400 hover:text-zinc-600">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
