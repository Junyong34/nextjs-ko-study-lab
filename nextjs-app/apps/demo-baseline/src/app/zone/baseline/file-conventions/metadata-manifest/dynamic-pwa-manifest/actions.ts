'use server'

import { cookies } from 'next/headers'
import { isKnownPresetId, MANIFEST_THEME_COOKIE, resolveThemePreset } from './theme-presets'
import type { ThemePreset } from './types'

/**
 * 실습 화면에서 테마 프리셋을 고르면 호출되는 실제 Server Action이다.
 * `(await cookies()).set()`이 실제 Set-Cookie 응답 헤더를 브라우저로 보내고, 그 쿠키를
 * manifest.ts가 다음 `GET /manifest.webmanifest` 요청에서 그대로 읽는다 — 클라이언트 state를
 * 서버 응답에 옮겨 쓰는 시늉이 아니라, 실제 쿠키 저장소를 경유한다.
 */
export async function setManifestThemeAction(presetId: string): Promise<ThemePreset> {
  if (!isKnownPresetId(presetId)) {
    throw new Error(`알 수 없는 테마 프리셋 id: ${presetId}`)
  }

  const cookieStore = await cookies()
  cookieStore.set(MANIFEST_THEME_COOKIE, presetId, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60,
  })

  return resolveThemePreset(presetId)
}

/** 초기화 버튼용 Server Action. 쿠키를 지워 manifest.ts가 기본 프리셋으로 되돌아가게 한다. */
export async function resetManifestThemeAction(): Promise<ThemePreset> {
  const cookieStore = await cookies()
  cookieStore.delete(MANIFEST_THEME_COOKIE)

  return resolveThemePreset(undefined)
}
