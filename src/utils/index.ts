export function hasKey<K extends string>(
  obj: unknown,
  key: K,
): obj is { [key in K]: unknown } {
  return typeof obj === 'object' && obj !== null && key in obj;
}
