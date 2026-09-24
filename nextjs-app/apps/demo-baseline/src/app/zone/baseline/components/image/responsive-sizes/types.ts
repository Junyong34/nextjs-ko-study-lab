export type SizesPresetId = 'omitted' | 'grid' | 'undersized'

export interface SizesPreset {
  id: SizesPresetId
  label: string
  /** undefined면 sizes prop 자체를 넘기지 않는다. */
  sizes: string | undefined
  hint: string
}

export type CaseId = 'appImage' | 'nativeFill' | 'fixedWidth'

/** 렌더된 srcset 속성을 파싱한 후보 하나. value는 w 서술자면 폭(px), x 서술자면 배율. */
export interface SrcsetCandidate {
  url: string
  value: number
  kind: 'w' | 'x'
}

/** 렌더된 <img> DOM에서 직접 읽은 값. */
export interface ImgProbe {
  /** 어떤 렌더(프리셋·재요청 횟수)에 대한 측정인지 구분하는 태그 */
  tag: string
  srcsetAttr: string | null
  sizesAttr: string | null
  currentSrc: string
  /** HTMLImageElement.naturalWidth — w 서술자 선택 시 밀도(density)로 보정된 값 */
  naturalWidth: number
  /** currentSrc를 srcset 없이 새 Image()로 다시 읽은 실제 파일 폭 */
  fileWidth: number | null
  position: string
  boxWidth: number
  boxHeight: number
  parentWidth: number
  parentHeight: number
  viewportWidth: number
  dpr: number
  /** sizes 속성을 현재 뷰포트에서 브라우저 CSS로 평가한 슬롯 폭(px) */
  slotWidth: number | null
  candidates: SrcsetCandidate[]
  chosen: SrcsetCandidate | null
}

export interface CaseVerdict {
  id: CaseId
  title: string
  expected: string
  actual: string
  matched: boolean
}
