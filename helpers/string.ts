export const isCapital = (char: string) => /[A-Z]/.test(char);

/** Can get uppercase or lowercase alphabet as array */
export const getAlphabet = (a: 'A' | 'a', A = a.charCodeAt(0)) =>
  [...Array(26)].map(() => String.fromCharCode(A++));

export const containsNumbers = (str: string) => /\d/.test(str);

export const extractNumbers = (str: string) => {
  return (str.match(/-?\d+/g) ?? []).map(Number);
};

export const extractLetterGroups = (inputString: string): string[] => {
  return inputString.match(/[a-zA-Z]+/g) ?? [];
};
