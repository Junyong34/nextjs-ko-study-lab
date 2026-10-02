import type { MatchResult, PatternSet, RemotePattern, UrlCase } from '../types'

/*
 * 공식 문서(components/image.md "remotePatterns")에 적힌 규칙을 옮긴 판정 함수다.
 * Next.js 내부 matcher를 불러오지 않으므로, 화면의 정답은 "문서 규칙에 따른 계산"이다.
 * - protocol·port·search: 지정하면 정확히 같아야 한다. 생략하면 `**`가 암시돼 아무 값이나 통과한다.
 * - hostname: 필수. `*`는 서브도메인 한 단계, 맨 앞의 `**.`는 서브도메인 한 단계 이상.
 * - pathname: 생략하면 `**`. `*`는 경로 세그먼트 하나, 끝의 `/**`는 그 아래 전부.
 */
const escapeRegExp = (s: string) => s.replace(/[.+?^${}()|[\]\\*]/g, '\\$&')

function hostnameRegExp(glob: string): RegExp {
  if (glob === '**') return /^.+$/
  const body = escapeRegExp(glob)
    .replace(/^\\\*\\\*\\\./, '(?:[^.]+\\.)+')
    .replace(/\\\*/g, '[^.]+')
  return new RegExp(`^${body}$`)
}

function pathnameRegExp(glob: string): RegExp {
  if (glob === '**') return /^.*$/
  const body = escapeRegExp(glob)
    .replace(/\/\\\*\\\*$/, '(?:/.*)?')
    .replace(/\\\*/g, '[^/]+')
  return new RegExp(`^${body}$`)
}

/** 일치하면 null, 아니면 처음 어긋난 필드 설명 */
function firstMismatch(p: RemotePattern, url: URL): string | null {
  const protocol = url.protocol.replace(/:$/, '')
  if (p.protocol !== undefined && p.protocol !== protocol) return `protocol ${protocol} ≠ ${p.protocol}`
  if (p.port !== undefined && p.port !== url.port) return `port '${url.port}' ≠ '${p.port}'`
  if (!hostnameRegExp(p.hostname).test(url.hostname)) return `hostname ${url.hostname} 불일치 (${p.hostname})`
  if (p.search !== undefined && p.search !== url.search) return `search '${url.search}' ≠ '${p.search}'`
  const pathname = p.pathname ?? '**'
  if (!pathnameRegExp(pathname).test(url.pathname)) return `pathname ${url.pathname} 불일치 (${pathname})`
  return null
}

export function judgeUrl(set: PatternSet, raw: string): MatchResult {
  const url = new URL(raw)
  const misses = set.patterns.map((p) => firstMismatch(p, url))
  const hit = misses.indexOf(null)
  if (hit !== -1) return { verdict: 'allow', reason: `패턴 #${hit + 1}과 모든 필드가 일치` }
  return { verdict: 'block', reason: misses.map((m, i) => `#${i + 1}: ${m}`).join(' / ') }
}

export const PATTERN_SETS: PatternSet[] = [
  {
    id: 'strict',
    label: '좁은 패턴 (권장)',
    code: `images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.shop.example', port: '',
      pathname: '/products/**', search: '' },
    { protocol: 'https', hostname: '**.img.example', port: '',
      pathname: '/public/*' },
  ],
}`,
    patterns: [
      { protocol: 'https', hostname: 'cdn.shop.example', port: '', pathname: '/products/**', search: '' },
      { protocol: 'https', hostname: '**.img.example', port: '', pathname: '/public/*' },
    ],
  },
  {
    id: 'broad',
    label: "넓은 패턴 (hostname: '**')",
    code: `images: {
  // protocol·port·pathname·search 생략 → 전부 ** 로 암시된다
  remotePatterns: [{ hostname: '**' }],
}`,
    patterns: [{ hostname: '**' }],
  },
]

// .example은 예시용으로 예약된 TLD라 실제 호스트가 아니다. 이 화면은 이 URL들로 네트워크 요청을 보내지 않는다.
export const URL_CASES: UrlCase[] = [
  { id: 'c1', url: 'https://cdn.shop.example/products/shoes/runner.png' },
  { id: 'c2', url: 'http://cdn.shop.example/products/runner.png', note: 'http로 내려받으면 중간자가 이미지를 바꿔치기할 수 있습니다.' },
  { id: 'c3', url: 'https://cdn.shop.example/products/runner.png?w=4000', note: "search: ''는 쿼리 문자열이 없어야 한다는 뜻입니다. 쿼리로 원본 서버에 큰 변환을 시키는 우회를 막습니다." },
  { id: 'c4', url: 'https://eu.img.example/public/banner.png' },
  { id: 'c5', url: 'https://img.example/public/banner.png', note: '맨 앞 **.는 서브도메인이 하나 이상 있어야 일치합니다. 루트 도메인도 허용하려면 패턴을 따로 추가합니다.' },
  { id: 'c6', url: 'https://eu.img.example/public/2026/banner.png', note: '*는 경로 세그먼트 하나만 일치합니다. 하위 폴더까지 허용하려면 끝에 /**를 씁니다.' },
  {
    id: 'c7',
    url: 'http://169.254.169.254/latest/meta-data',
    note: '클라우드 메타데이터 주소입니다. 넓은 패턴은 이 URL도 통과시킵니다. Next.js 16은 dangerouslyAllowLocalIP: false(기본값)로 사설 IP를 한 번 더 막지만, 패턴 자체가 방어선이 되도록 좁게 씁니다.',
  },
]
