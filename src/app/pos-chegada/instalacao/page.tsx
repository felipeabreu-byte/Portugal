import { getHousingDetails } from "@/actions/post-arrival";
import { HousingForm } from "@/components/PostArrival/HousingForm";

export const dynamic = "force-dynamic";

export default async function InstalacaoPage() {
    const housing = await getHousingDetails();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Habitação & Instalação 🏠</h2>
                <p className="text-gray-500 mt-1">
                    Gerencie seu status de moradia e planeje seu alojamento em Portugal.
                </p>
            </div>

            <HousingForm initialData={{
                status: housing?.housingStatus || "TEMPORARY",
                monthly: housing?.housingMonthly ? Number(housing.housingMonthly) : null,
                city: housing?.housingCity || "",
                startDate: housing?.housingStartDate ? housing.housingStartDate.toISOString().split('T')[0] : "",
                tempDays: housing?.housingTempDays || null
            }} />
        </div>
    );
}
