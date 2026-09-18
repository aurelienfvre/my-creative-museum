"use client";
import ProfileDisclosure from "./profile-disclosure";
import ProfileField from "./profile-field";
import ProfileForm from "./profile-form";

export default function ProfileSettings({ user }) {
  return (
    <section aria-label="Modifier mes informations" className="min-w-0">
      <ProfileDisclosure title="Nom" value={user.name}>
        <ProfileForm kind="name">
          <ProfileField
            label="Votre nom"
            name="name"
            defaultValue={user.name}
            autoComplete="name"
            maxLength={100}
            pattern={".*\\S.*"}
          />
        </ProfileForm>
      </ProfileDisclosure>
      <ProfileDisclosure title="Adresse email" value={user.email}>
        {user.emailVerified ? (
          <p className="pb-8 text-sm text-muted">
            Le changement d’une adresse vérifiée nécessite un email de
            confirmation. Ce service n’est pas encore disponible.
          </p>
        ) : (
          <ProfileForm kind="email">
            <ProfileField
              label="Nouvelle adresse email"
              name="email"
              type="email"
              defaultValue={user.email}
              autoComplete="email"
              maxLength={254}
            />
            <ProfileField
              label="Mot de passe actuel"
              name="currentPassword"
              password
              autoComplete="current-password"
              maxLength={128}
            />
          </ProfileForm>
        )}
      </ProfileDisclosure>
      <ProfileDisclosure title="Mot de passe">
        <ProfileForm kind="password">
          <ProfileField
            label="Mot de passe actuel"
            name="currentPassword"
            password
            autoComplete="current-password"
            maxLength={128}
          />
          <ProfileField
            label="Nouveau mot de passe (8 caractères minimum)"
            name="newPassword"
            password
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
          />
          <ProfileField
            label="Confirmer le nouveau mot de passe"
            name="confirmPassword"
            password
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
          />
          <p className="text-sm text-muted">
            Les autres appareils seront déconnectés après la modification.
          </p>
        </ProfileForm>
      </ProfileDisclosure>
    </section>
  );
}
