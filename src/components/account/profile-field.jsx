"use client";
import { useId, useState } from "react";
import Icon from "@/components/ui/icon";

export default function ProfileField({
  label,
  name,
  password = false,
  ...props
}) {
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
