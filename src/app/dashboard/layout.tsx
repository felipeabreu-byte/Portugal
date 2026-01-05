import { Sidebar } from "@/components/Sidebar";
import { MobileMenu } from "@/components/MobileMenu";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
            <MobileMenu />
            <Sidebar />
            <main className="flex-1 overflow-auto p-4 md:p-8 mt-16 md:mt-0">
                {children}
            </main>
        </div>
    );
}
