import type { ExpectedState, PreloadVariant, VariantOption } from '../types'

export const VARIANTS: VariantOption[] = [
  { id: 'none', label: '기본값', hint: 'priority·preload 모두 미지정 — loading="lazy"' },
  { id: 'priority', label: 'priority', hint: 'Next.js 16부터 deprecated', deprecated: true },
  { id: 'preload', label: 'preload', hint: 'priority를 대체하는 현재 권장 prop' },
]

const HERO_IMAGE_PATH = '/zone/baseline/components/image/priority-lcp-preload/hero-image'

/** 실제 파일 시스템 라우트(hero-image/route.ts)가 응답하는 진짜 네트워크 URL. */
export function buildHeroImageUrl(variant: PreloadVariant): string {
  return `${HERO_IMAGE_PATH}?variant=${variant}`
}

// next/image의 실제 소스(apps/demo-baseline/node_modules/next/dist/shared/lib/get-img-props.js)를
// 직접 읽어 확인한 사실:
// - loading: isLazy = !priority && !preload && (loading==='lazy' || loading===undefined). isLazy가
//   true면 브라우저에 "lazy" 문자열이 박히고, false면 loading 속성 자체가 사라진다("eager" 문자열이
//   박히는 게 아니다).
// - fetchPriority는 이 계산과 무관한 별도 prop이다 — Next.js가 priority/preload에서 자동으로
//   fetchPriority="high"를 만들어 주지 않는다. 그래서 검증 대상에서 제외했다(DeepDive 3번 참고).
export const EXPECTED_BY_VARIANT: Record<PreloadVariant, ExpectedState> = {
  none: { loading: 'lazy', preloadLink: false },
  priority: { loading: null, preloadLink: true },
  preload: { loading: null, preloadLink: true },
}
