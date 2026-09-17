"use client";
import { useId, useState } from "react";
import Icon from "@/components/ui/icon";
export default function PasswordField({ signup, className }) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-muted">
        Mot de passe
      </label>
      <div className="relative">
        <input
          id={id}
          name="password"
          type={visible ? "text" : "password"}
          autoComplete={signup ? "new-password" : "current-password"}
          required
          minLength={signup ? 8 : 1}
          maxLength={128}
          aria-describedby={signup ? `${id}-help` : undefined}
          className={`${className} pr-14`}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={
            visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
          aria-controls={id}
          aria-pressed={visible}
          className="absolute right-0 bottom-0 grid min-h-11 min-w-11 place-items-center text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Icon name={visible ? "eyeOff" : "eye"} className="size-5" />
        </button>
      </div>
      {signup && (
        <p id={`${id}-help`} className="mt-3 text-sm text-muted">
          8 caractères minimum.
        </p>
      )}
    </div>
  );
}
