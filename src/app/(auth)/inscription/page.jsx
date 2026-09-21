import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/auth-form";
import { auth } from "@/lib/auth";
export const metadata = {
  title: "Inscription",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/");
  return (
    <>
      <h1 className="mb-10 text-[2.8rem] leading-none tracking-[-.055em] text-foreground lg:text-[3.6rem]">
        Bienvenue.
      </h1>
      <AuthForm mode="signup" />
    </>
  );
}
