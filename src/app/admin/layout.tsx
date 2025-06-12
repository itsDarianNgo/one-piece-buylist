import { AdminHeader } from "@/components/admin/admin-header";

// This layout component will wrap all pages inside the `/admin` route.
// It ensures that common UI elements like the header are consistently applied.
export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <AdminHeader />
            <main className="py-8">
                {children}
            </main>
        </div>
    );
}