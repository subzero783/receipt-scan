import { auth } from "@/utils/authOptions"; // Adjust path to your auth.js file
import Link from "next/link";
import ClientSignOut from "@/components/ClientSignOut";

export default async function Home() {
  const session = await auth();

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
