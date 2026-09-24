import type { ModeConfig, PrefetchMode } from './types'

export const BASE_PATH = '/zone/baseline/guides/optimizing-prefetching/bandwidth-saver'

/** 대규모 카탈로그를 흉내 내는 것이 아니라 실제로 96개의 <Link>를 렌더링한다. */
export const CATALOG_SIZE = 96

export const SKUS = Array.from({ length: CATALOG_SIZE }, (_, i) => `SKU-${String(i + 1).padStart(3, '0')}`)

export const MODES: ModeConfig[] = [
  {
    key: 'full',
    label: '전체 prefetch',
    code: '<Link prefetch={true}>',
    summary: '보이는 링크마다 목적지 page까지 서버 렌더',
  },
  {
    key: 'auto',
    label: '기본값',
    code: '<Link>',
    summary: '보이는 링크마다 loading.tsx 경계까지',
  },
  {
    key: 'hover',
    label: 'hover 기반',
    code: '<HoverPrefetchLink>',
    summary: 'prefetch={active ? null : false} — 마우스를 올린 링크만',
  },
  {
    key: 'off',
    label: '비활성화',
    code: '<Link prefetch={false}>',
    summary: '클릭 전까지 요청 없음',
  },
]

export const MODE_KEYS: PrefetchMode[] = MODES.map((m) => m.key)

export function isPrefetchMode(value: string): value is PrefetchMode {
  return (MODE_KEYS as string[]).includes(value)
}

/** 모드마다 목적지 URL을 분리해, 한 모드의 Client Cache가 다른 모드의 측정을 오염시키지 않게 한다. */
export function itemHref(mode: PrefetchMode, sku: string) {
  return `${BASE_PATH}/item/${mode}/${sku}`
}

const ITEM_URL_PATTERN = /\/optimizing-prefetching\/bandwidth-saver\/item\/([a-z]+)\/(SKU-\d{3})/

/** Resource Timing 엔트리 URL에서 모드와 SKU를 꺼낸다. 목적지 요청이 아니면 null. */
export function parseItemUrl(url: string): { mode: PrefetchMode; sku: string } | null {
  const match = ITEM_URL_PATTERN.exec(url)
  if (!match || !isPrefetchMode(match[1])) return null
  return { mode: match[1], sku: match[2] }
}
