export interface PresetSpec {
  label: string
  stale: number
  revalidate: number
  expire: number
}

/**
 * Next.js 16.3.2 공식 문서(node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cacheLife.md
 * → "Preset cache profiles" 표)에서 확인한 내장 프리셋의 실제 stale/revalidate/expire 초 값이다.
 * next.config.ts에서 재정의하지 않는 한 이 값 그대로 적용된다.
 *
 * 'use cache'/next/cache import가 없는 별도 파일로 분리했다 — cachedData.ts(서버 전용,
 * next/cache 의존)를 클라이언트 컴포넌트가 직접 import하면 그 의존성까지 클라이언트 번들에
 * 유입되어 빌드 에러가 나기 때문이다.
 */
export const PRESET_SPECS: Record<'seconds' | 'hours' | 'max', PresetSpec> = {
  seconds: { label: "cacheLife('seconds')", stale: 30, revalidate: 1, expire: 60 },
  hours: { label: "cacheLife('hours')", stale: 300, revalidate: 3600, expire: 86400 },
  max: { label: "cacheLife('max')", stale: 300, revalidate: 2_592_000, expire: 31_536_000 },
}
