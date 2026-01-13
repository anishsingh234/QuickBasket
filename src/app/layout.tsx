import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getUserFromCookies } from "@/services/helper";
import UserProvider from "./_context/UserContext";
import { ToastProvider } from "./_context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickBasket",
  description: "Your one-stop shop for everything",
};

type UserWithoutPassword = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "STAFF";
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user: UserWithoutPassword | null = await getUserFromCookies();

  return (
    <UserProvider user={user ?? undefined}>
      <ToastProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
          </body>
        </html>
      </ToastProvider>
    </UserProvider>
  );
}
