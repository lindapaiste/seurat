export type Unpack<T> = T extends Array<infer U> ? U : T;

export const replaceIndex = <T extends any[]>(
  array: T,
  i: number,
  value: Unpack<T>
): T => {
  return Object.assign([...array], { [i]: value }) as T;
};
