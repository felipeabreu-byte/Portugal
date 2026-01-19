'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserProfile } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateTravelDetails(data: {
    travelDate: Date | null;
    city: string | null;
    profile: UserProfile;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    const { travelDate, city, profile } = data;

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            travelDate,
            city,
            profile
        }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/trip");
}
