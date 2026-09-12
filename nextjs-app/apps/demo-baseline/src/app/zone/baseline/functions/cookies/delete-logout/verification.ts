export function verifyCookieDeletion(
  history: { created: boolean; deleted: boolean },
  observation: { present: boolean } | null,
): boolean | undefined {
  if (!observation) return undefined
  return history.created && history.deleted && !observation.present
}
