/** api/catalog Route Handler가 받은 요청을 그대로 되돌려 준 값 */
export interface CatalogEcho {
  receivedPath: string
  receivedSearch: string
  requestCount: number
  servedAt: string
}

/** 서버 컴포넌트(page.tsx)가 렌더 중에 실행한 fetch 한 번의 실측 결과 */
export type FetchRun =
  | {
      ok: true
      url: string
      sentSearch: string
      status: number
      durationMs: number
      echo: CatalogEcho
      renderedAt: string
      nodeEnv: string
    }
  | { ok: false; url: string; error: string; renderedAt: string; nodeEnv: string }
