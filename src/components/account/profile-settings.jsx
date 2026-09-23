"use client";
import { useId, useState } from "react";
import Icon from "@/components/ui/icon";
import ProfileDisclosure from "./profile-disclosure";
import useProfileForm from "./use-profile-form";

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

function ProfileForm({ kind, children, disabled = false }) {
  const { submit, pending, feedback } = useProfileForm(kind);
  return (
    <form onSubmit={submit} aria-busy={pending} className="pb-6 lg:pb-8">
      <fieldset
        disabled={pending || disabled}
        className="min-w-0 space-y-5 disabled:opacity-60 lg:space-y-6"
      >
        {children}
        <button
          type="submit"
          className="min-h-12 w-full bg-foreground px-6 py-3 text-background transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed sm:w-auto"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </fieldset>
      {feedback && (
        <p
          role={feedback.error ? "alert" : "status"}
          className={`mt-4 text-sm ${feedback.error ? "text-red-800" : "text-foreground"}`}
        >
          {feedback.error || feedback.success}
        </p>
      )}
    </form>
  );
}

function ProfileField({ label, name, password = false, ...props }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          id={id}
          name={name}
          required
          data-password-field={password || undefined}
          type={
            password ? (visible ? "text" : "password") : props.type || "text"
          }
          className={`mt-2 w-full min-w-0 border-b border-line bg-transparent py-3 text-[max(16px,1rem)] text-ink outline-offset-4 focus:border-foreground ${password ? "pr-14" : ""}`}
        />
        {password && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={`${visible ? "Masquer" : "Afficher"} : ${label.toLowerCase()}`}
            aria-controls={id}
            aria-pressed={visible}
            className="absolute right-0 bottom-0 grid min-h-11 min-w-11 place-items-center text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Icon name={visible ? "eyeOff" : "eye"} className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}
