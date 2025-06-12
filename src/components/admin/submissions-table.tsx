"use client"; // This component is now interactive

import { useTransition } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { type Submission, Status } from "@prisma/client";
import { updateSubmissionStatus } from "@/actions/submissions";
import { toast } from "sonner";

interface SubmissionsTableProps {
    submissions: Submission[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
    // useTransition hook gives us a pending state for our Server Action
    const [isPending, startTransition] = useTransition();

    const handleStatusUpdate = (submissionId: string, newStatus: Status) => {
        startTransition(async () => {
            const result = await updateSubmissionStatus(submissionId, newStatus);
            if (result.error) {
                toast.error(result.error);
            } else if (result.success) {
                toast.success(result.success);
            }
        });
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);

    return (
        <Table>
            <TableCaption>A list of all card submissions.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Seller Name</TableHead>
                    <TableHead>Seller Email</TableHead>
                    <TableHead className="text-right">Est. Quantity</TableHead>
                    <TableHead className="text-right">Quoted Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {submissions.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            No submissions found.
                        </TableCell>
                    </TableRow>
                ) : (
                    submissions.map((submission) => (
                        <TableRow key={submission.id}>
                            <TableCell>
                                <Badge variant="outline">{submission.status.replace("_", " ")}</Badge>
                            </TableCell>
                            <TableCell>{submission.createdAt.toLocaleDateString()}</TableCell>
                            <TableCell>{submission.sellerName}</TableCell>
                            <TableCell>{submission.sellerEmail}</TableCell>
                            <TableCell className="text-right">{submission.estimatedQuantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(submission.quotedPrice)}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                                            <span className="sr-only">Open menu</span>
                                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {Object.values(Status).map((status) => (
                                            <DropdownMenuItem
                                                key={status}
                                                onSelect={() => handleStatusUpdate(submission.id, status)}
                                                disabled={submission.status === status}
                                            >
                                                {status.replace("_", " ")}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}