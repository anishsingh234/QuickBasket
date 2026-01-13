"use client";

import React, { createContext, ReactNode } from "react";

type UserWithoutPassword = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "STAFF";
};

export const UserContext = createContext<{
  user?: UserWithoutPassword;
  isStaff?: boolean;
}>({});

export default function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user?: UserWithoutPassword;
}) {
  const isStaff = user?.role === "STAFF";
  
  return (
    <UserContext.Provider
      value={{
        user,
        isStaff,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
