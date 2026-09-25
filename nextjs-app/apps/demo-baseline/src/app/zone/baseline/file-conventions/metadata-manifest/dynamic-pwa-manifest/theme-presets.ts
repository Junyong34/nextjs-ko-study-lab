import type { ThemePreset } from './types'

/**
 * manifest.ts(생성 함수) · actions.ts(Server Action) · MetadataManifestDemo.tsx(실습 화면)가
 * 공유하는 단일 출처다. 프리셋 id가 실제 쿠키 값으로 저장되고, manifest.ts가 그 값을 읽어
 * theme_color / background_color를 계산하므로 기대값을 화면에 별도로 하드코딩하지 않는다.
 * 쿠키 이름은 이 zone 앱 안의 다른 데모와 겹치지 않도록 데모 슬러그를 접두어로 둔다.
 */
export const MANIFEST_THEME_COOKIE = 'demo-manifest-theme-preset'

export const SEGMENT_PATH =
  '/zone/baseline/file-conventions/metadata-manifest/dynamic-pwa-manifest'

/**
 * 실제 GET 엔드포인트. `manifest.webmanifest/route.ts`(실제 Route Handler)가 이 경로에
 * 라우팅된다 — 폴더명에 점(.)이 있어도 Next.js 파일 시스템 라우팅은 이를 평범한 세그먼트
 * 이름으로 취급한다(이 값을 `next dev --port 3017`로 직접 확인함).
 */
export const MANIFEST_ENDPOINT = `${SEGMENT_PATH}/manifest.webmanifest`

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'default', label: '기본 블루', themeColor: '#2563eb', backgroundColor: '#ffffff' },
  { id: 'midnight', label: '미드나이트', themeColor: '#0f172a', backgroundColor: '#0f172a' },
  { id: 'sunset', label: '선셋 오렌지', themeColor: '#ea580c', backgroundColor: '#fff7ed' },
  { id: 'forest', label: '포레스트 그린', themeColor: '#15803d', backgroundColor: '#f0fdf4' },
]

export const DEFAULT_PRESET_ID = THEME_PRESETS[0].id

export function resolveThemePreset(id: string | null | undefined): ThemePreset {
  return THEME_PRESETS.find((preset) => preset.id === id) ?? THEME_PRESETS[0]
}

export function isKnownPresetId(id: string): boolean {
  return THEME_PRESETS.some((preset) => preset.id === id)
}
