import { useCallback } from "react";
import {
  NamespaceRelativeKey,
  TranslationKey,
  TranslationNamespace,
  translations,
} from "../lang";

type Translator<N extends TranslationNamespace | undefined> = N extends string
  ? (key: NamespaceRelativeKey<N> | TranslationKey) => string
  : (key: TranslationKey) => string;

export const useTranslations = <N extends TranslationNamespace | undefined>(
  namespace?: N,
) => {
  const translate = useCallback(
    (rawKey: string) => {
      if (rawKey in translations) {
        return translations[rawKey as TranslationKey];
      }

      if (namespace) {
        const namespacedKey = `${namespace}.${rawKey}`;
        if (namespacedKey in translations) {
          return translations[namespacedKey as TranslationKey];
        }
      }

      return rawKey;
    },
    [namespace],
  );

  return { t: translate as Translator<N> };
};
