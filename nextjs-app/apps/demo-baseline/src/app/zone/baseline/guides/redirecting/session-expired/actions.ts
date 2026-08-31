'use server'

import { redirect } from 'next/navigation'

export async function expireSessionAction() {
  redirect('/zone/baseline/guides/redirecting/session-expired/login?returnUrl=%2Fcheckout')
}
