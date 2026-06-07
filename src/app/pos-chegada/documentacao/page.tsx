import { getPostArrivalDocs } from "@/actions/post-arrival";
import { DocsList } from "@/components/PostArrival/DocsList";

export const dynamic = "force-dynamic";

export default async function DocumentacaoPage() {
    const docs = await getPostArrivalDocs();

    // Convert decimal/date representations for client serializability
    const formattedDocs = docs.map(d => ({
        id: d.id,
        type: d.type,
        status: d.status,
        emissionDate: d.emissionDate ? d.emissionDate.toISOString().split('T')[0] : "",
        notes: d.notes || "",
        fileUrl: d.fileUrl || ""
    }));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Documentação Pós-Chegada 📄</h2>
                <p className="text-gray-500 mt-1">
                    Monitore a obtenção e status dos seus registros fundamentais em Portugal.
                </p>
            </div>

            <DocsList initialDocs={formattedDocs} />
        </div>
    );
}
