'use server'

import { cookies } from 'next/headers'
import { VALID_SESSION_TOKEN } from './orders'

const AUTH_COOKIE_NAME = 'demo_headers_auth_token'
const TAMPERED_TOKEN = 'sess_8921_forged'

export async function loginAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, VALID_SESSION_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
}

export async function tamperTokenAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, TAMPERED_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}
