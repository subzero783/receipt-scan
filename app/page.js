"use client";
import Link from "next/link";
import ClientSignOut from "@/components/ClientSignOut";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Next-Auth v5 + MongoDB (JavaScript)</h1>
      {session?.user ? (
        <div>
          <p>You are signed in as {session.user.name}</p>
          <ClientSignOut />
          <br />
          <Link href="/dashboard">Go to Dashboard (Protected)</Link>
        </div>
      ) : (
        <div>
          <p>You are not signed in.</p>
          <Link href="/login">Login</Link>
          <br />
          <Link href="/register">Register</Link>
        </div>
      )}
    </main>
  );
}
