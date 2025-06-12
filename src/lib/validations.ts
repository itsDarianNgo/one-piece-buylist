import { z } from "zod";

// This schema defines the shape of the data for our submission form.
// It ensures that any data, whether from the client-side form or a direct API call,
// adheres to the same set of rules.

export const SubmissionSchema = z.object({
    // Seller's name must be a string between 2 and 50 characters.
    sellerName: z
        .string()
        .min(2, { message: "Name must be at least 2 characters." })
        .max(50, { message: "Name must be 50 characters or less." }),

    // Seller's email must be a valid email format.
    sellerEmail: z
        .string()
        .email({ message: "Please enter a valid email address." }),

    // Estimated quantity is tricky because HTML forms submit numbers as strings.
    // z.coerce.number() gracefully converts the string to a number before validation.
    // We ensure it's a positive integer within a reasonable range.
    estimatedQuantity: z.coerce
        .number({ invalid_type_error: "Please enter a valid number." })
        .int({ message: "Quantity must be a whole number." })
        .positive({ message: "Quantity must be greater than 0." })
        .min(1, { message: "You must send at least 1 card." })
        .max(10000, { message: "For quantities over 10,000, please contact us." }),
});

// We can infer the TypeScript type directly from our Zod schema.
// This is incredibly powerful because it means our validation rules and our types
// are always in sync. We'll use this type in our form component.
export type SubmissionFormData = z.infer<typeof SubmissionSchema>;