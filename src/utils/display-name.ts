export function normalizeDisplayName(value: string) {
  return value.replace(/\p{L}+(?:['’\-/]\p{L}+)*/gu, (word) => {
    if (word !== word.toLocaleUpperCase()) return word;

    return word
      .toLocaleLowerCase()
      .replace(
        /(^|['’\-/])(\p{L})/gu,
        (_match, separator: string, letter: string) =>
          `${separator}${letter.toLocaleUpperCase()}`,
      );
  });
}
