import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/auth-shell";
import SignOutButton from "@/components/auth/sign-out-button";
import { auth } from "@/lib/auth";
export const metadata = {
  title: "Mon compte",
  robots: { index: false, follow: false },
};
export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/connexion");
  return (
    <AuthShell title="Mon compte.">
      <p className="break-words text-2xl text-ink">
        Bonjour {session.user.name}.
      </p>
      <p className="mt-4 break-all text-muted">{session.user.email}</p>
      <SignOutButton />
    </AuthShell>
  );
}
