export function getAuthErrorMessage(error, mode) {
  if (error?.status === 429) {
    return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
  }
  if (error?.status === 0) {
    return "Impossible de joindre le serveur. Vérifiez votre connexion internet, puis réessayez.";
  }
  if (error?.status >= 500) {
    return "Le service est momentanément indisponible. Réessayez dans quelques instants.";
  }

  switch (error?.code) {
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "Un compte existe déjà avec cette adresse email. Connectez-vous ou utilisez une autre adresse pour vous inscrire.";
    case "INVALID_EMAIL_OR_PASSWORD":
    case "INVALID_PASSWORD":
      return mode === "signup"
        ? "Choisissez un mot de passe entre 8 et 128 caractères."
        : "L’adresse email ou le mot de passe est incorrect. Vérifiez vos identifiants et réessayez.";
    case "INVALID_EMAIL":
      return "Saisissez une adresse email valide, par exemple nom@exemple.fr.";
    case "PASSWORD_TOO_SHORT":
      return "Votre mot de passe doit contenir au moins 8 caractères.";
    case "PASSWORD_TOO_LONG":
      return "Votre mot de passe ne doit pas dépasser 128 caractères.";
    case "EMAIL_NOT_VERIFIED":
      return "Votre adresse email n’est pas encore confirmée. Ouvrez le lien reçu par email avant de vous connecter.";
    default:
      return mode === "signup"
        ? "La création du compte a échoué. Réessayez dans quelques instants."
        : "La connexion a échoué. Réessayez dans quelques instants.";
  }
}
