import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// This page is shown after a user successfully submits the form.
// It provides clear confirmation and reassurance.
export default function SuccessPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 text-center shadow-sm">
                <div className="flex justify-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Submission Received!
                    </h1>
                    <p className="text-muted-foreground">
                        Thank you for your submission. We have sent an email with shipping instructions and next steps. Please check your inbox (and spam folder).
                    </p>
                </div>
                <Button asChild>
                    <Link href="/">Submit Another Buylist</Link>
                </Button>
            </div>
        </main>
    );
}