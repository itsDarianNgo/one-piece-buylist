import { SubmissionForm } from "@/components/submission-form";

// This is the main landing page for the buylist application.
// It's a Server Component, so it's fast and SEO-friendly.
// Its only job is to provide context and render the client-side form component.
export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-4 rounded-lg border bg-white p-8 shadow-sm">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                        One Piece Super Rare Buylist
                    </h1>
                    <p className="text-muted-foreground">
                        Selling your bulk cards? Fill out the form below to get started.
                    </p>
                </div>
                <SubmissionForm />
            </div>
        </main>
    );
}