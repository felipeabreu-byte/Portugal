
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await fetch("https://economia.awesomeapi.com.br/last/EUR-BRLT", {
            cache: 'no-store',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!res.ok) {
            throw new Error(`Upstream API failed with status: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Exchange Rate Proxy Error:", error);
        return NextResponse.json({ error: "Failed to fetch exchange rate" }, { status: 500 });
    }
}
