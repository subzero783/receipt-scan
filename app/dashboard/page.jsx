// app/dashboard/page.jsx

import { auth } from "@/utils/authOptions"; // Adjust path to your auth.js file
import { redirect } from "next/navigation";
import ClientSignOut from "@/components/ClientSignOut"; // We'll create this next

export default async function Dashboard() {
  const session = await auth(); // Get session on the server

  if (!session?.user) {
    redirect("/login"); // Protect the route
  }

  return (
    <div>
      <h1>Dashboard (Protected)</h1>
      <p>Welcome, {session.user.name}!</p>
      <p>Your email is: {session.user.email}</p>
      <ClientSignOut />
    </div>
  );
}
