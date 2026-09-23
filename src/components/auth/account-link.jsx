"use client";
import TransitionLink from "@/components/animation/transition-link";
import Icon from "@/components/ui/icon";
import { authClient } from "@/lib/auth-client";
export default function AccountLink() {
  const { data } = authClient.useSession();
  return (
    <TransitionLink
      href={data ? "/compte" : "/connexion"}
      prefetch={false}
      aria-label="Mon compte"
      className="grid size-11 place-items-center lg:size-8 [&>svg]:w-[1.2rem]"
    >
      <Icon name="user" />
    </TransitionLink>
  );
}
