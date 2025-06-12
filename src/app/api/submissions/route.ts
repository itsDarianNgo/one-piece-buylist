import { NextResponse } from "next/server";
import { SubmissionSchema } from "@/lib/validations";

// This is a TEMPORARY, MOCKED API route for testing the front-end form.
// It does NOT connect to the database yet.

export async function POST(request: Request) {
    // We'll simulate a real-world scenario by pretending to parse the body.
    // This helps ensure the front-end is sending data in the correct format.
    const body = await request.json();

    // We can even validate it using our shared schema to be thorough.
    const validation = SubmissionSchema.safeParse(body);

    if (!validation.success) {
        // If validation fails, return a 400 Bad Request error.
        return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    // Simulate network/database latency to test our loading spinners.
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Mock API received:", validation.data);

    // Return a successful JSON response.
    // The front-end form's `toast.promise` will interpret this as a success.
    return NextResponse.json({ message: "Submission successful!" }, { status: 200 });
}