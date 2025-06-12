import { LoginForm } from "@/components/auth/login-form";

// This is the server component for the login route.
// It sets up the page layout and renders the client-side LoginForm.
export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-sm space-y-4 rounded-lg border bg-white p-8 shadow-sm">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Admin Login
                    </h1>
                    <p className="text-muted-foreground">
                        Enter your credentials to access the dashboard.
                    </p>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}