/** 인라인 스크립트가 가장 먼저 설치하는 관찰 객체. window.__cspDemo에 담긴다. */
export interface Violation {
  /** 위반된 지시문 (예: script-src-elem, script-src-attr) */
  directive: string
  /** 차단된 코드의 앞부분 (CSP가 알려주는 sample) */
  sample: string
  /** 파싱 중 발생했는지, 사용자가 주입 시도를 눌러 발생했는지 */
  origin: 'parse' | 'injection'
}

export interface CspDemoState {
  nonceRan: boolean
  /** nonce 일치 인라인 스크립트가 document.currentScript.nonce로 읽은 값 */
  scriptNonce: string | null
  /** nonce 없는 인라인 스크립트가 실행됐는지 (차단되면 false로 남아야 한다) */
  blockedRan: boolean
  nextScriptRan: boolean
  nextScriptNonce: string | null
  violations: Violation[]
}

declare global {
  interface Window {
    __cspDemo?: CspDemoState
    /** 주입 시도한 onerror 핸들러가 실행되면 true가 된다 (차단되면 undefined). */
    __cspInjectionRan?: boolean
  }
}

/** 같은 URL을 fetch로 다시 요청해 얻은 응답 한 건. 헤더와 HTML을 같은 응답에서 읽는다. */
export interface NonceSample {
  status: number
  /** 응답 Content-Security-Policy 헤더에서 뽑은 nonce */
  headerNonce: string | null
  /** 같은 응답 HTML의 nonce 속성 값 목록 (중복 제거) */
  htmlNonces: string[]
  /** 응답 헤더에 unsafe-inline이 script-src에 없는지 */
  strict: boolean
}

export interface InjectionResult {
  ran: boolean
  violations: Violation[]
}

export interface PageSnapshot {
  /** 서버 컴포넌트가 headers()로 읽은 x-nonce */
  serverNonce: string | null
  /** 직전 로드의 nonce (sessionStorage). 첫 로드면 null */
  previousNonce: string | null
  demo: CspDemoState | null
}
