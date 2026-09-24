/** 문서에서 실제로 읽은 <link> 태그 속성 */
export interface HeadIconLink {
  rel: string
  /** getAttribute('href') 원문 (Next.js가 렌더링한 값 그대로) */
  href: string
  sizes: string | null
  type: string | null
  inHead: boolean
}

/** 그 href를 실제로 fetch하고 이미지로 디코딩한 결과 */
export interface IconFetchResult {
  status: number | null
  contentType: string | null
  cacheControl: string | null
  nextCache: string | null
  byteLength: number | null
  naturalWidth: number | null
  naturalHeight: number | null
  /** 미리보기용 blob: URL */
  previewUrl: string | null
  error: string | null
}

export interface MeasuredIcon {
  link: HeadIconLink
  pathname: string
  /** href의 쿼리스트링 (Next.js가 붙인 해시) */
  query: string
  result: IconFetchResult
}

export interface ProbeSnapshot {
  measuredAt: string
  icons: MeasuredIcon[]
  /** icons: null을 두지 않은 비교 라우트(no-reset)의 HTML에서 읽은 링크 */
  noResetLinks: HeadIconLink[] | null
  noResetError: string | null
}
