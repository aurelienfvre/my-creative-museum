"use client";
import TransitionLink from "@/components/animation/transition-link";
import PasswordField from "./password-field";
import useAuthForm from "./use-auth-form";

const field =
  "mt-2 w-full min-w-0 border-b border-line bg-transparent py-3 text-[max(16px,1rem)] text-ink outline-offset-4 focus:border-foreground";
export default function AuthForm({ mode }) {
  const signup = mode === "signup";
  const { submit, pending, error } = useAuthForm(mode);
  return (
    <form
      onSubmit={submit}
      className="space-y-5 lg:space-y-6"
      aria-busy={pending}
    >
      <fieldset disabled={pending} className="min-w-0 space-y-5 lg:space-y-6">
        {signup && (
          <label className="block text-sm text-muted">
            Nom
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              pattern={".*\\S.*"}
              className={field}
            />
          </label>
        )}
        <label className="block text-sm text-muted">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className={field}
          />
        </label>
        <PasswordField signup={signup} className={field} />
        <button
          type="submit"
          className="min-h-12 w-full bg-foreground px-6 py-4 text-background transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {pending
            ? "Un instant…"
            : signup
              ? "Créer mon compte"
              : "Se connecter"}
        </button>
      </fieldset>
      {error && (
        <p role="alert" className="text-sm text-red-800">
          {error}
        </p>
      )}
      <p className="text-sm text-muted">
        {signup ? "Déjà un compte ? " : "Pas encore de compte ? "}
        <TransitionLink
          prefetch={false}
          href={signup ? "/connexion" : "/inscription"}
          className="text-foreground underline underline-offset-4"
        >
          {signup ? "Se connecter" : "S’inscrire"}
        </TransitionLink>
      </p>
    </form>
  );
}
