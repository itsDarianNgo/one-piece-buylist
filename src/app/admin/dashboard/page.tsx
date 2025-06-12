import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { SubmissionsTable } from "@/components/admin/submissions-table";

// This page is now simpler. The header and overall page structure
// are handled by the new `src/app/admin/layout.tsx`.
export default async function AdminDashboardPage() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/login");
    }

    const submissions = await prisma.submission.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="container mx-auto">
            {/* The SubmissionsTable is the primary content of this specific page. */}
            <SubmissionsTable submissions={submissions} />
        </div>
    );
}