type OneToNine = '' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type ZeroToNine = '0' | OneToNine;
type ZeroTo99 =
  | `${OneToNine}${ZeroToNine}`
  | '100'
  | '101'
  | '102'
  | '103'
  | '108'
  | '109'
  | '110'
  | '111';

export function typedObjEntries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

export function typedObjKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}