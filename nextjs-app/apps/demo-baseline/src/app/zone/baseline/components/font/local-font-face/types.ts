export type LocalFontWeight = '400' | '700'

export interface LocalFontMeta {
  /** next/font/local이 생성한 실제 className (build time에 컴파일된 값) */
  className: string
  /** next/font/local이 생성한 실제 font-family 문자열. 예: "'__Gaegu_xxxxxx', '__Gaegu_Fallback_xxxxxx'" */
  fontFamily: string
  /** 실제 로컬 .woff2 파일의 상대 경로 (localFont src 배열에 넘긴 값) */
  sources: Array<{ path: string; weight: LocalFontWeight }>
}

export interface FontFaceProbeResult {
  /** document.styleSheets에서 실제로 찾은 @font-face CSSOM 규칙 텍스트 목록 */
  fontFaceRules: string[]
  /** 미리보기 요소의 getComputedStyle(el).fontFamily 값 */
  computedFontFamily: string
  /** 미리보기 요소의 getComputedStyle(el).fontWeight 값 */
  computedFontWeight: string
  /** document.fonts에 해당 family가 실제 로드 완료 상태로 등록됐는지 */
  isFontLoaded: boolean
  /** 프로브가 완료됐는지 (완료 전에는 검증 패널이 "대기 중" 상태를 유지) */
  isReady: boolean
}
