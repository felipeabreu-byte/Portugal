import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { targetAmount: true }
    });

    return NextResponse.json({ targetAmount: user?.targetAmount || 0 });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { targetAmount } = body;

    await prisma.user.update({
        where: { email: session.user.email },
        data: { targetAmount: Number(targetAmount) }
    });

    return NextResponse.json({ message: "Updated" });
}
