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
        <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <Icon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            {progress !== undefined && (
                <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                    <div
                        className={`h-full rounded-full ${color || "bg-blue-600"}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
