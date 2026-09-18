"use client";
import useProfileForm from "./use-profile-form";

export default function ProfileForm({ kind, children, disabled = false }) {
  const { submit, pending, feedback } = useProfileForm(kind);
  return (
    <form onSubmit={submit} aria-busy={pending} className="pb-8">
      <fieldset
        disabled={pending || disabled}
        className="space-y-6 disabled:opacity-60"
      >
        {children}
        <button
          type="submit"
          className="min-h-12 bg-foreground px-6 py-3 text-background transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed"
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
