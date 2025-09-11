import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

interface ClerkAuthProviderProps {
  children: React.ReactNode;
}

export function ClerkAuthProvider({ children }: ClerkAuthProviderProps) {
  return React.createElement(ClerkProvider, null, children);
}