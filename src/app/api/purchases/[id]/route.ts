import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = params.id;

        // Verify ownership
        const purchase = await prisma.purchase.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!purchase) {
            return NextResponse.json({ message: "Purchase not found" }, { status: 404 });
        }

        if (purchase.user.email !== session.user.email) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await prisma.purchase.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting purchase" },
            { status: 500 }
        );
    }
}
