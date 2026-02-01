import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TravelForm } from "@/components/TravelForm";

export const dynamic = "force-dynamic";

export default async function TripPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            travelDate: true,
            city: true,
            profile: true
        }
    });

    if (!user) {
        redirect("/login");
    }

    const initialData = {
        travelDate: user.travelDate ? user.travelDate.toISOString() : null,
        city: user.city,
        profile: user.profile
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Minha Viagem</h2>
            </div>

            <div className="max-w-2xl">
                <TravelForm initialData={initialData} />
            </div>
        </div>
    );
}

