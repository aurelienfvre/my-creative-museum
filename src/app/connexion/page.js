import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/auth-form";
import AuthShell from "@/components/auth/auth-shell";
import { auth } from "@/lib/auth";
export const metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/");
  return (
    <AuthShell title="Connexion.">
      <AuthForm mode="signin" />
    </AuthShell>
  );
}
