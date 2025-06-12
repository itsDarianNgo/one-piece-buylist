import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { SubmissionsTable } from "@/components/admin/submissions-table";

// This is a React Server Component. It runs only on the server.
export default async function AdminDashboardPage() {
    // Defense-in-depth: Although middleware protects this route,
    // we also check for a user session here.
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/login");
    }

    // Fetch all submission data from the database using Prisma.
    // We order by `createdAt` in descending order to show newest first.
    const submissions = await prisma.submission.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="container mx-auto py-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                    View and manage all incoming submissions.
                </p>
            </header>
            <main>
                {/* We pass the fetched data to our presentational component. */}
                <SubmissionsTable submissions={submissions} />
            </main>
        </div>
    );
}