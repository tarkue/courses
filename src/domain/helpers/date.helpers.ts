export function getExpiresDate(days: number): Date {
  const timeNow = new Date().getTime();
  return new Date(timeNow + days * 24 * 60 * 60 * 1000);
}
