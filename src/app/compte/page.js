import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountBackButton from "@/components/account/account-back-button";
import ProfileIntro from "@/components/account/profile-intro";
import ProfileSettings from "@/components/account/profile-settings";
import FavoritesGallery from "@/components/favorites/favorites-gallery";
import { auth } from "@/lib/auth";
import { favorites } from "@/lib/favorites";
import { getObjects, publicObject } from "@/lib/museum";
export const metadata = {
  title: "Mon compte",
  robots: { index: false, follow: false },
};
export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/connexion");
  const [slugs, collection] = await Promise.all([
    favorites.list(session.user.id),
    getObjects(),
  ]);
  const bySlug = new Map(collection.map((object) => [object.slug, object]));
  const objects = slugs
    .map((slug) => bySlug.get(slug))
    .filter(Boolean)
    .map(publicObject);
  return (
    <main id="main" className="page-gutter min-h-svh pt-10 lg:pt-16">
      <div className="mb-5" data-arrive>
        <AccountBackButton />
      </div>
      <ProfileIntro
        user={{ name: session.user.name, email: session.user.email }}
      >
        <ProfileSettings
          user={{
            name: session.user.name,
            email: session.user.email,
            emailVerified: session.user.emailVerified,
          }}
        />
      </ProfileIntro>
      <FavoritesGallery key={session.user.id} objects={objects} />
    </main>
  );
}
