import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/auth-form";
import { auth } from "@/lib/auth";
export const metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/");
  return (
    <>
      <h1 className="mb-7 text-[2.8rem] leading-none tracking-[-.055em] text-foreground lg:mb-10 lg:text-[3.6rem]">
        Connexion.
      </h1>
      <AuthForm mode="signin" />
    </>
  );
}
