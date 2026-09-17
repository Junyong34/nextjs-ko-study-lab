export const EXPECTED_RETURN_URL = '/checkout'

export function matchesReturnUrl(returnUrl: string | undefined): boolean {
  if (typeof returnUrl !== 'string') return false
  return returnUrl.trim() === EXPECTED_RETURN_URL
}
