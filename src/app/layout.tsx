import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // <-- IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Streamer Buylist",
    description: "Sell your One Piece cards!",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors /> {/* <-- ADD THIS COMPONENT */}
        </body>
        </html>
    );
}