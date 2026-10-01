/** 한 테넌트 URL 을 fetch 해서 응답 HTML 에서 읽은 값 */
export interface TenantSnapshot {
  id: string
  status: number
  /** 응답 HTML 의 <title> */
  title: string | null
  /** data-tenant-root 요소의 data-tenant 값 */
  rootId: string | null
  /** 테넌트 영역 style 속성에 주입된 CSS 변수 값 */
  primaryVar: string | null
  accentVar: string | null
  logo: string | null
  /** 이 테넌트 영역 안에서 발견된 다른 테넌트의 이름·색상 */
  leaked: string[]
}

/** 지금 화면(live DOM)에서 getComputedStyle·document.title 로 읽은 값 */
export interface LiveSnapshot {
  tenant: string | null
  title: string
  primaryVar: string
  swatchRgb: string
  logoFillRgb: string | null
  logo: string | null
}
