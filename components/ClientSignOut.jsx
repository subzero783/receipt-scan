"use client";

import { signOut } from "next-auth/react";

export default function ClientSignOut() {
  return <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>;
}
