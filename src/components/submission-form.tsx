"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { SubmissionSchema, type SubmissionFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// This is the core component for our buylist submission form.
// It handles state management, validation, and submission logic.
export function SubmissionForm() {
    const router = useRouter();

    // 1. Define the form with react-hook-form.
    //    We use our Zod schema with zodResolver to automate validation.
    //    Default values are set here for a clean initial state.
    const form = useForm<SubmissionFormData>({
        resolver: zodResolver(SubmissionSchema),
        defaultValues: {
            sellerName: "",
            sellerEmail: "",
            // Important: The input will be type="number", but the state should be handled
            // as a number. Zod's coerce will handle the string-to-number conversion.
            estimatedQuantity: undefined,
        },
    });

    const { isSubmitting } = form.formState;

    // 2. Define the handler that runs when the form is submitted with valid data.
    async function onSubmit(values: SubmissionFormData) {
        // This function sends the validated form data to our API endpoint.
        const promise = fetch("/api/submissions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        // We use sonner's promise toast for a great UX.
        // It automatically shows loading, success, and error states.
        toast.promise(promise, {
            loading: "Submitting your buylist...",
            success: (response) => {
                // If the API call was successful, redirect to the success page.
                router.push("/success");
                return "Submission successful! Please check your email for next steps.";
            },
            error: (err) => {
                // If the API returns an error, we display it here.
                // This handles server-side issues gracefully.
                console.error("Submission failed:", err);
                return "An error occurred. Please try again later.";
            },
        });
    }

    // 3. Build the form's JSX using shadcn's Form components.
    //    This structure links our form fields to the state managed by react-hook-form.
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="sellerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sellerEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    {...field}
                                    disabled={isSubmitting}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="estimatedQuantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Super Rare Cards</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g., 50"
                                    {...field}
                                    // react-hook-form handles number conversion but we ensure onChange doesn't pass NaN
                                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || undefined)}
                                    disabled={isSubmitting}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit Buylist
                </Button>
            </form>
        </Form>
    );
}