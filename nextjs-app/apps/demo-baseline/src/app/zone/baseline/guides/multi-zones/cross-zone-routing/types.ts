/** 응답 HTML의 `<script src>` 접두사로 판별한 zone. assetPrefix가 zone마다 다르기 때문에 가능한 판별이다. */
export type ZoneName = 'shell' | 'baseline' | 'cache' | 'unknown'

export type ProbeKey = 'learner' | 'internal' | 'cache'

/** 같은 origin에 문서 요청 한 번을 보낸 결과 */
export interface PageProbe {
  key: ProbeKey
  path: string
  status: number
  zone: ZoneName
  /** 응답 HTML에서 처음 발견한 _next/static 스크립트 경로 */
  firstScript: string | null
  /** x-powered-by 응답 헤더. baseline zone은 poweredByHeader: false라 없다 */
  poweredBy: string | null
}

/** cache zone 정적 자산(/demo-static/cache/_next/...)을 같은 origin에서 요청한 결과 */
export interface AssetProbe {
  path: string
  status: number
  contentType: string | null
}

export interface ProbeRun {
  origin: string
  pages: Record<ProbeKey, PageProbe>
  asset: AssetProbe | null
  /** 이 페이지가 실제로 내려받은 스크립트 자산의 접두사별 개수 (performance resource 항목) */
  ownAssets: { baseline: number; other: number }
  measuredAt: string
}

/** 학습자가 누를 수 있는 이동 4종 */
export type HopKind = 'link-same' | 'a-same' | 'link-cross' | 'a-cross'

/** iframe 안에서 이동 한 번이 끝난 뒤 관찰한 결과 */
export interface HopRecord {
  kind: HopKind
  path: string
  /** iframe 문서의 performance.timeOrigin이 바뀌었으면 새 문서(전체 로드) */
  newDocument: boolean
  /** 새 문서일 때 navigation 항목의 type (navigate/reload/back_forward) */
  navType: string | null
  zone: ZoneName
  /** 소프트 이동 뒤 화면에 실제로 그려진 페이지 표식(data-hop-screen) */
  screen: string | null
}

/** baseline 서버가 이 페이지를 렌더링하며 받은 요청 헤더 (page.tsx에서 headers()로 읽음) */
export interface ServerSeen {
  host: string | null
  forwardedHost: string | null
  renderedAt: string
}
