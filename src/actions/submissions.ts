"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Status } from "@prisma/client";
import { z } from "zod";

// This is a Next.js Server Action. It's a function that runs securely on the server
// and can be called directly from client components.

// We define a schema to validate the inputs to our action.
const updateStatusSchema = z.object({
    id: z.string().cuid(),
    status: z.nativeEnum(Status),
});

export async function updateSubmissionStatus(submissionId: string, newStatus: Status) {
    // 1. VALIDATE INPUTS
    const validation = updateStatusSchema.safeParse({ id: submissionId, status: newStatus });
    if (!validation.success) {
        return { error: "Invalid input." };
    }

    // 2. AUTHENTICATE USER
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "You must be logged in to perform this action." };
    }

    // 3. UPDATE THE DATABASE
    try {
        await prisma.submission.update({
            where: {
                id: validation.data.id,
            },
            data: {
                status: validation.data.status,
            },
        });

        // 4. REVALIDATE CACHE
        // This tells Next.js to re-fetch the data for the admin dashboard
        // on the next request, so the UI shows the updated status.
        revalidatePath("/admin/dashboard");

        return { success: `Status updated to ${newStatus}.` };
    } catch (error) {
        console.error("Failed to update submission status:", error);
        return { error: "Database error. Could not update status." };
    }
}