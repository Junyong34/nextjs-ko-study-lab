'use server'

import { cookies } from 'next/headers'
import { ROLE_COOKIE_NAME, type DemoRole } from './types'

export async function getCurrentDemoRole(): Promise<DemoRole> {
  const cookieStore = await cookies()
  return cookieStore.get(ROLE_COOKIE_NAME)?.value === 'admin' ? 'admin' : 'customer'
}

export async function setDemoRoleAction(role: DemoRole): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(ROLE_COOKIE_NAME, role, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
}

export async function resetDemoRoleAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ROLE_COOKIE_NAME)
}
