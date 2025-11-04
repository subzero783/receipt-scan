import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession();

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
