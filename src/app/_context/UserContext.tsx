"use client";

import React, { createContext, ReactNode } from "react";
import { useState } from "react";

type UserWithoutPassword = {
  id: string;
  name: string;
  email: string;
  
};
export const UserContext = createContext<{
  user?: UserWithoutPassword;
}>({});
export default function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user?: UserWithoutPassword;
}) {
  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
