import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            targetAmount: true,
            name: true,
            age: true,
            phone: true
        }
    });

    return NextResponse.json({
        targetAmount: user?.targetAmount || 0,
        name: user?.name || "",
        age: user?.age || "", // Send as string for easier form handling if needed, or number
        phone: user?.phone || ""
    });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { targetAmount, name, age, phone } = body;

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            targetAmount: Number(targetAmount),
            name: name,
            age: age ? Number(age) : null,
            phone: phone
        }
    });

    return NextResponse.json({ message: "Update" });
}
