import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/settings/:path*",
        "/purchases/:path*",
        "/((?!login|register|api|_next/static|_next/image|favicon.ico).*)",
    ]
};
