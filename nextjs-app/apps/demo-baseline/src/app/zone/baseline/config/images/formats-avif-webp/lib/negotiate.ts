import type { ImageFormat } from '../types'

/*
 * next@16.3.2 image-optimizer의 출력 포맷 결정(getSupportedMimeType)을 옮긴 계산이다.
 * Next.js는 번들한 @hapi/accept의 mediaType(accept, formats)로 고른 뒤, 그 타입이 Accept 문자열에
 * 그대로 들어 있을 때만 쓴다. 결과가 빈 문자열이면 원본 포맷을 유지한다.
 * Next.js 모듈을 불러오지 않으므로 화면의 값은 "소스 규칙에 따른 계산"이며 optimizer 응답이 아니다.
 */
interface Entry {
  token: string
  type: string
  subtype: string
  q: number
  specificity: number
  pos: number
}

const VALID = /^(?:\*\/\*)|(?:[\w!#$%&'*+\-.^`|~]+\/\*)|(?:[\w!#$%&'*+\-.^`|~]+\/[\w!#$%&'*+\-.^`|~]+)$/

function parse(header: string): { listed: Set<string>; entries: Entry[] } {
  const listed = new Set<string>()
  const entries: Entry[] = []
  ;(header || '*/*').replace(/[ \t]/g, '').split(',').forEach((part, pos) => {
    if (!part) return
    const [rawToken, ...params] = part.split(';')
    const token = rawToken.toLowerCase()
    if (!VALID.test(token)) return
    let q = 1
    let specificity = 0
    let afterQ = false
    for (const param of params) {
      const [key, value] = param.split('=')
      if (key === 'q' || key === 'Q') {
        const n = Number.parseFloat(value)
        q = !Number.isFinite(n) || n > 1 || (n < 0.001 && n !== 0) ? 1 : n
        afterQ = true
      } else if (!afterQ) {
        // q 앞의 매개변수만 미디어 타입의 구체성으로 센다(q 뒤는 확장 매개변수)
        specificity += 1
      }
    }
    const [type, subtype] = token.split('/')
    listed.add(token)
    if (q) entries.push({ token, type, subtype, q, specificity, pos })
  })
  return { listed, entries }
}

// q 내림차순 → type 이름순(와일드카드는 뒤) → subtype 이름순 → 매개변수 많은 순 → 헤더 순서
function compare(a: Entry, b: Entry): number {
  if (a.q !== b.q) return b.q - a.q
  for (const key of ['type', 'subtype'] as const) {
    if (a[key] !== b[key]) {
      if (a[key] === '*') return 1
      if (b[key] === '*') return -1
      return a[key] < b[key] ? -1 : 1
    }
  }
  if (a.specificity !== b.specificity) return b.specificity - a.specificity
  return a.pos - b.pos
}

export function negotiate(formats: ImageFormat[], accept: string): ImageFormat | null {
  const { listed, entries } = parse(accept)
  const ranked: ImageFormat[] = []
  for (const e of [...entries].sort(compare)) {
    if (e.type === '*') ranked.push(...formats.filter((f) => !listed.has(f)))
    else if (e.subtype === '*') ranked.push(...formats.filter((f) => f.startsWith(`${e.type}/`) && !listed.has(f)))
    else if ((formats as string[]).includes(e.token)) ranked.push(e.token as ImageFormat)
  }
  const chosen = ranked[0]
  return chosen && accept.includes(chosen) ? chosen : null
}
