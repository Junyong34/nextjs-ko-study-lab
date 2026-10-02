/** 서버(Server Action)가 이 zone의 /_next/image에 직접 보낸 요청과 받은 응답 */
export interface EndpointProbe {
  id: 'local' | 'remote'
  label: string
  /** origin을 뺀 실제 요청 경로(쿼리 포함) */
  requestPath: string
  status: number
  contentType: string | null
  /** text/plain 응답이면 본문(optimizer 오류 메시지 자리), 그 밖에는 null */
  textBody: string | null
  bytes: number
}

export type ProbeOutcome =
  | { ok: true; origin: string; results: EndpointProbe[]; measuredAt: string }
  | { ok: false; error: string }

/** 서버 렌더 시 getImageProps()가 현재 next.config로 계산한 <img> 속성 */
export interface ComputedImgProps {
  label: string
  input: string
  src: string
  srcSet: string | null
}

/** 렌더된 <img>를 브라우저에서 읽은 DOM 값 */
export interface DomSnapshot {
  srcAttr: string | null
  srcsetAttr: string | null
  currentPath: string
  naturalWidth: number
}

/** next.config.ts images.remotePatterns의 객체 형식 한 항목 */
export interface RemotePattern {
  protocol?: 'http' | 'https'
  hostname: string
  port?: string
  pathname?: string
  search?: string
}

export type PatternSetId = 'strict' | 'broad'

export interface PatternSet {
  id: PatternSetId
  label: string
  code: string
  patterns: RemotePattern[]
}

export interface UrlCase {
  id: string
  url: string
  /** 패턴 판정과 별개로 알아 둘 점(답안 확인 후 표시) */
  note?: string
}

export type Verdict = 'allow' | 'block'

export interface MatchResult {
  verdict: Verdict
  reason: string
}
