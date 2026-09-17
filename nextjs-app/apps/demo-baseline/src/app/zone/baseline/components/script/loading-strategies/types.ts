/** next/script strategy 값 4종. worker는 실험적 기능이며 App Router 미지원(공식 문서 경고). */
export type ScriptStrategy = 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker'

export const STRATEGY_ORDER: ScriptStrategy[] = ['beforeInteractive', 'afterInteractive', 'lazyOnload', 'worker']

export const STRATEGY_LABEL: Record<ScriptStrategy, string> = {
  beforeInteractive: 'beforeInteractive',
  afterInteractive: 'afterInteractive (기본값)',
  lazyOnload: 'lazyOnload',
  worker: 'worker (실험적, 미지원 확인용)',
}

/** timing-script 라우트가 실제로 서빙하는 프로브 스크립트의 실측 로드 이벤트가 실릴 CustomEvent 이름 */
export const SCRIPT_LOADED_EVENT = 'script-loading-strategies:loaded'

/** 이 시간(ms) 안에도 worker 이벤트가 안 오면 "미실행 확정"으로 표시한다 */
export const WORKER_TIMEOUT_MS = 4000

/** timing-script 라우트의 내부 경로. next/script의 src로 그대로 사용한다(실제 Route Handler). */
export const TIMING_SCRIPT_PATH = '/zone/baseline/components/script/loading-strategies/timing-script'

/** timing-script가 실행되는 순간 window 커스텀 이벤트로 실어 보내는 1건의 실측 기록 */
export interface ScriptLoadEvent {
  strategy: ScriptStrategy
  /** performance.now() 기준, 이 프로브 스크립트가 실제로 실행된 시각 */
  loadedAt: number
  /** 실행 시점의 document.readyState 실측값 */
  readyState: DocumentReadyState
}
