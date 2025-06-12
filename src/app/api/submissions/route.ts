import { NextResponse } from "next/server";
import { SubmissionSchema } from "@/lib/validations";
import prisma from "@/lib/db";
import { ZodError } from "zod";

// Define a constant for the price per card.
const CARD_PRICE_USD = 0.25;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = SubmissionSchema.parse(body);

        const quotedPrice = validatedData.estimatedQuantity * CARD_PRICE_USD;

        const newSubmission = await prisma.submission.create({
            data: {
                sellerName: validatedData.sellerName,
                sellerEmail: validatedData.sellerEmail,
                estimatedQuantity: validatedData.estimatedQuantity,
                quotedPrice: quotedPrice,
            },
        });

        return NextResponse.json(newSubmission, { status: 201 });

    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }

        console.error("Failed to create submission:", error);

        return NextResponse.json(
            { error: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}