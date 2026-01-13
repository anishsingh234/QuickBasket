import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - QuickBasket",
  description: "Login or Sign up to QuickBasket",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
