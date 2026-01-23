import { LucideIcon } from "lucide-react";

type SummaryCardProps = {
    title: string;
    value: string;
    subtitle: string;
    icon: LucideIcon;
    color?: string; // e.g., "bg-blue-600" for progress bar
    progress?: number;
};

export function SummaryCard({ title, value, subtitle, icon: Icon, color, progress }: SummaryCardProps) {
    return (
        <div className="rounded-xl border border-white/60 bg-white/60 backdrop-blur-md p-6 shadow-sm">
            <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <div className="p-2 bg-white/50 rounded-full shadow-sm">
                    <Icon className="h-4 w-4 text-gray-600" />
                </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{value}</div>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            {progress !== undefined && (
                <div className="mt-3 h-2 w-full rounded-full bg-gray-200/50">
                    <div
                        className={`h-full rounded-full ${color || "bg-blue-500"}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
