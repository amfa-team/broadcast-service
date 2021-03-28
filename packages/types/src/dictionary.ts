export type Dictionary = {
  join: string;
  cgu: string;
  error: {
    unknown: {
      title: string;
      text: string;
      retryBtn: string;
    };
  };
};

export const defaultDictionary: Record<"fr" | "en", Dictionary> = {
  en: {
    join: "Join",
    cgu: "By clicking on join, I accept the CGUs",
    error: {
      unknown: {
        title: "Oops: an error occurred",
        text: "If the problem persist, please contact the support",
        retryBtn: "Retry",
      },
    },
  },
  fr: {
    join: "Rejoindre",
    cgu: "En cliquant sur rejoindre j'accepte les cgu",
    error: {
      unknown: {
        title: "Oups: une erreur est survenue",
        text: "Si le probleme persiste, veuillez contacter le support",
        retryBtn: "Réessayer",
      },
    },
  },
};
