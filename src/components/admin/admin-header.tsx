"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export function AdminHeader() {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error("Logout failed. Please try again.");
            console.error("Logout error:", error);
            return;
        }

        // Refreshing the router is crucial. It clears the client-side cache
        // and ensures a fresh server request, fully clearing the user's session state.
        router.refresh();
        router.push("/login");
        toast.success("You have been logged out.");
    };

    return (
        <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">
                    Buylist Dashboard
                </h1>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </header>
    );
}