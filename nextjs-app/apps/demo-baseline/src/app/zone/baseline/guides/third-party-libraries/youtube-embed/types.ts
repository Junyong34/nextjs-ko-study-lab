// 공개 영상 ID(Next.js 공식 문서의 YouTubeEmbed 예시와 같은 영상). 바꾸려면 이 상수만 고친다.
export const VIDEO_ID = 'ogfYd705cRs'
export const PLAY_LABEL = 'Next.js 소개 영상 재생'
export const CONTROL_SRC = `https://www.youtube.com/embed/${VIDEO_ID}`

// facade(포스터·버튼)를 그리는 데 쓰이는 호스트: lite-yt-embed의 JS·CSS와 썸네일 이미지
export const FACADE_HOSTS = ['cdn.jsdelivr.net', 'i.ytimg.com']

export type LitePhase = 'idle' | 'loading' | 'facade' | 'activated' | 'error'

/** 특정 시간 구간 동안 performance resource 항목으로 관측한 외부 요청 */
export interface RequestTally {
  /** 외부 호스트별 요청 수 */
  byHost: Record<string, number>
  /** 플레이어(iframe 문서·YouTube API) 요청 수 */
  player: number
}

export interface EmbedMeasure {
  /** 실습 영역 안 실제 <iframe> 요소 수 */
  iframes: number
  iframeSrc: string | null
  tally: RequestTally
}
