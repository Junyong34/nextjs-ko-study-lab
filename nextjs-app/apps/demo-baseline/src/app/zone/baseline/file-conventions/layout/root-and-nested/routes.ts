import type { ChainNode } from './types'

export const BASE = '/zone/baseline/file-conventions/layout/root-and-nested'

/** 이 데모 디렉터리 안에 실제로 존재하는 layout.tsx 파일과 그 파일이 놓인 세그먼트 */
export const DEMO_LAYOUTS = [
  { file: 'root-and-nested/layout.tsx', segment: '' },
  { file: 'root-and-nested/clothing/layout.tsx', segment: 'clothing' },
  { file: 'root-and-nested/clothing/tops/layout.tsx', segment: 'clothing/tops' },
] as const

/** 실제 page.tsx가 있는 경로. rel은 BASE 뒤의 상대 경로 */
export const ROUTES = [
  { rel: '', label: '전체', page: 'root-and-nested/page.tsx' },
  { rel: 'clothing', label: '의류', page: 'root-and-nested/clothing/page.tsx' },
  { rel: 'clothing/tops', label: '의류 > 상의', page: 'root-and-nested/clothing/tops/page.tsx' },
  { rel: 'clothing/bottoms', label: '의류 > 하의', page: 'root-and-nested/clothing/bottoms/page.tsx' },
  { rel: 'electronics', label: '전자기기', page: 'root-and-nested/electronics/page.tsx' },
] as const

/** 루트 layout(src/app/layout.tsx) metadata의 title.template이 붙이는 접미사 */
export const ROOT_TITLE_SUFFIX = ' | Baseline 데모 - Next.js 학습'

export function toRel(pathname: string): string {
  return pathname.startsWith(BASE) ? pathname.slice(BASE.length).replace(/^\/+|\/+$/g, '') : pathname
}

export function hrefOf(rel: string): string {
  return rel ? `${BASE}/${rel}` : BASE
}

export function displayRel(rel: string): string {
  return `/${rel}`
}

/**
 * 파일 시스템 규칙에서 기대 목록을 계산한다: layout은 자기 세그먼트와 그 아래 모든 경로에 적용된다.
 * (관측값이 아니라 공식 문서 규칙을 코드로 옮긴 기대값)
 */
export function expectedLayouts(rel: string): string[] {
  return DEMO_LAYOUTS.filter(
    (l) => l.segment === '' || rel === l.segment || rel.startsWith(`${l.segment}/`),
  ).map((l) => l.file)
}

export function layoutFilesOf(chain: ChainNode[]): string[] {
  return chain.flatMap((n) => (n.kind === 'layout' ? [n.file] : []))
}

/** 중첩 layout은 데모 폴더 접두사를 떼고, 데모 layout 자체는 그대로 둔다 (layout.tsx만 남으면 모호하다). */
export function shortFile(file: string): string {
  return file === 'root-and-nested/layout.tsx' ? file : file.replace(/^root-and-nested\//, '')
}
