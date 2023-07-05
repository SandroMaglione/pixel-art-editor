export const lerp = (a: number, b: number, n: number): number =>
  (1 - n) * a + n * b;
export const clamp = (min: number, max: number) => (n: number) =>
  Math.min(Math.max(min, n), max);
