export interface RouteCheck {
  /** 요청한 [lang] 세그먼트 */
  lang: string
  /** 기대 HTTP 상태 (지원 언어 200, 미지원 404) */
  expectedStatus: number
  /** 실제 HTTP 상태 */
  status: number
  /** 응답 HTML의 data-route-lang 값 (없으면 null) */
  renderedLang: string | null
  /** 응답 HTML의 상품 목록 제목 */
  heading: string | null
  ok: boolean
}
