export type FontKey = 'inter' | 'roboto' | 'playfair-display'

export interface FontMeta {
  key: FontKey
  label: string
  /** next/font/google가 생성한 실제 className (font-family + fallback 지정) */
  className: string
  /** next/font/google가 생성한 실제 className (variable 옵션 — CSS 변수 선언) */
  variableClassName: string
  /** variable 옵션에 넘긴 CSS 변수 이름. 예: --font-inter */
  variableName: string
  /** next/font/google이 반환한 실제 style.fontFamily 문자열 (fallback 포함, 빌드 타임 해시 포함) */
  fontFamily: string
  /** fontFamily에서 추출한 1차 family 이름 (document.fonts / CSSOM 조회용) */
  primaryFamily: string
  /** 이 폰트에 실제 요청한 가변 폰트 wght 축의 최소/최대값 (weight: '${min} ${max}') */
  weightRange: { min: number; max: number }
}

export interface VariableFontProbeResult {
  /** 미리보기 요소에서 getComputedStyle().getPropertyValue(variableName)로 실측한 CSS 변수 값 */
  cssVariableValue: string
  /** document.styleSheets에서 실제로 찾은, primaryFamily를 포함하는 @font-face CSSOM 규칙 텍스트 목록 */
  fontFaceRules: string[]
  /** 그 규칙들의 font-weight 디스크립터 목록 (가변 폰트라면 "100 900" 같은 범위 문자열) */
  fontFaceWeightDescriptors: string[]
  /** 미리보기 요소의 getComputedStyle(el).fontFamily */
  computedFontFamily: string
  /** 미리보기 요소의 getComputedStyle(el).fontWeight — 브라우저가 실제로 보간한 값 */
  computedFontWeight: string
  /** document.fonts.check(`${weight} 16px "family"`) 실측 결과 */
  isWeightAvailable: boolean
  /** 프로브가 완료됐는지 (완료 전에는 검증 패널이 "대기 중" 상태를 유지) */
  isReady: boolean
}
