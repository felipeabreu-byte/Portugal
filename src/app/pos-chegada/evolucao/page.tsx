import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPostArrivalDocs, getFinanceItems } from "@/actions/post-arrival";
import { calculateAchievements } from "@/lib/post-arrival-utils";
import clsx from "clsx";

export const dynamic = "force-dynamic";

export default async function EvolucaoPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            arrivalDate: true,
            housingStatus: true
        }
    });

    if (!user) redirect("/login");

    const docs = await getPostArrivalDocs();
    const financeItems = await getFinanceItems();

    // Days in Portugal
    const today = new Date();
    const arrivalDate = user.arrivalDate ? new Date(user.arrivalDate) : new Date();
    const diffTime = today.getTime() - arrivalDate.getTime();
    const daysInPortugal = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    const formattedDocs = docs.map(d => ({
        type: d.type,
        status: d.status
    }));

    const formattedItems = financeItems.map(f => ({
        type: f.type,
        category: f.category,
        amountEur: Number(f.amountEur)
    }));

    const achievements = calculateAchievements(formattedDocs, user.housingStatus, formattedItems, daysInPortugal);
    const completedCount = achievements.filter(a => a.completed).length;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Evolução & Conquistas 📈</h2>
                <p className="text-gray-500 mt-1">
                    Acompanhe as conquistas desbloqueadas na sua jornada de adaptação em Portugal.
                </p>
            </div>

            {/* Progress Header */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg w-full">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-extrabold">🏆 Suas Conquistas</h3>
                        <p className="text-amber-100 text-sm mt-0.5">
                            {completedCount} de {achievements.length} conquistadas
                        </p>
                    </div>
                    <div className="text-4xl font-extrabold">{completedCount}/{achievements.length}</div>
                </div>
                <div className="w-full bg-white/25 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-white h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(completedCount / achievements.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {achievements.map((ach) => (
                    <div
                        key={ach.id}
                        className={clsx(
                            "bg-white rounded-2xl border p-5 shadow-sm flex items-start gap-4 transition-all duration-300",
                            ach.completed
                                ? "border-amber-200 ring-1 ring-amber-200/40 shadow-amber-100/50 hover:shadow-md"
                                : "border-gray-100 opacity-50"
                        )}
                    >
                        {/* Badge */}
                        <div className={clsx(
                            "text-4xl flex items-center justify-center w-16 h-16 rounded-2xl border flex-shrink-0",
                            ach.completed
                                ? "bg-amber-50 border-amber-200 shadow-sm"
                                : "bg-gray-100 border-gray-200 grayscale"
                        )}>
                            {ach.icon}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className={clsx(
                                    "text-sm font-extrabold",
                                    ach.completed ? "text-gray-900" : "text-gray-500"
                                )}>
                                    {ach.title}
                                </h4>
                                <span className={clsx(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0",
                                    ach.completed
                                        ? "bg-amber-100 text-amber-800 border-amber-200"
                                        : "bg-gray-100 text-gray-400 border-gray-200"
                                )}>
                                    {ach.completed ? "🏆 Conquistado" : "🔒 Bloqueado"}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{ach.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* How to earn the remaining achievements */}
            {completedCount < achievements.length && (
                <div className="w-full bg-blue-50/50 rounded-2xl border border-blue-100 p-6 space-y-4">
                    <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                        💡 Como desbloquear o restante das conquistas
                    </h3>
                    <ul className="space-y-2 text-xs text-blue-900 leading-relaxed">
                        {achievements.filter(a => !a.completed).map(a => (
                            <li key={a.id} className="flex gap-2 items-start">
                                <span className="text-base flex-shrink-0">{a.icon}</span>
                                <div>
                                    <strong>{a.title}</strong>: {a.description}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
