import global from "./global.json";
import homepage from "./homepage.json";

const translationTree = {
  ...global,
  ...homepage,
} as const;

type TranslationTree = typeof translationTree;

type Join<Prefix extends string, Key extends string> = Prefix extends ""
  ? Key
  : `${Prefix}.${Key}`;

type FlattenKeys<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends string
    ? Join<Prefix, Extract<K, string>>
    : T[K] extends Record<string, unknown>
      ? FlattenKeys<T[K], Join<Prefix, Extract<K, string>>>
      : never;
}[keyof T];

export type TranslationKey = FlattenKeys<TranslationTree>;

type TranslationMap = Record<TranslationKey, string>;

const flatten = (
  tree: Record<string, unknown>,
  parentKey = ""
): TranslationMap => {
  return Object.entries(tree).reduce<TranslationMap>((acc, [key, value]) => {
    const composedKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "string") {
      acc[composedKey as TranslationKey] = value;
      return acc;
    }

    Object.assign(acc, flatten(value as Record<string, unknown>, composedKey));
    return acc;
  }, {} as TranslationMap);
};

export const translations = flatten(translationTree);

export type TranslationNamespace =
  TranslationKey extends `${infer Namespace}.${string}` ? Namespace : never;

type NamespaceKey<N extends string> = Extract<TranslationKey, `${N}.${string}`>;
export type NamespaceRelativeKey<N extends string> =
  NamespaceKey<N> extends `${N}.${infer Rest}` ? Rest : never;

export const translationKeys = Object.keys(translations) as TranslationKey[];
