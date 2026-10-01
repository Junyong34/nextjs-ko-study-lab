import type { ServerBootLogSnapshot } from '@/instrumentation'

export type ProbeRuntime = 'nodejs' | 'edge'

/** api/node·api/edge Route Handler가 돌려주는 한 번의 응답 */
export interface RegisterProbe {
  /** 응답한 Route Handler가 선언한 runtime 세그먼트 설정 */
  handlerRuntime: ProbeRuntime
  /** 그 런타임 안에서 register()가 globalThis에 남긴 스냅샷. 없으면 null */
  snapshot: ServerBootLogSnapshot | null
  /** 이 Route Handler 모듈이 처리한 요청 수 — 요청마다 1씩 증가하는 대조 카운터 */
  handlerRequestCount: number
  /** 이 Route Handler 모듈이 평가된 시각 — 모듈이 다시 로드되면 바뀐다 */
  handlerLoadedAtMs: number
  receivedAt: string
}

/** onRequestError가 남긴 로그 한 건 (api/fail 모듈이 console.error를 감싸 기록) */
export interface CapturedRequestError {
  message: string
  path: string
  routeType: string
  routePath: string
  capturedAt: string
}

export interface FailProbe {
  /** 실패 요청의 실제 응답 상태 */
  status: number
  /** 실패 요청 직후 확인한, 이번 실패로 새로 기록된 onRequestError 호출 */
  captured: CapturedRequestError[]
  /** 실패를 일으키기 전/후 register() 호출 수 — 오류가 서버를 재부팅시키지 않는다는 근거 */
  registerCountBefore: number | null
  registerCountAfter: number | null
}

/** 연속 요청 한 묶음의 실측 결과 */
export interface BurstResult {
  runtime: ProbeRuntime
  probes: RegisterProbe[]
  measuredAt: string
}

export type Prediction = 'unchanged' | 'increases'

export type ActionId = 'burst-nodejs' | 'burst-edge' | 'fail'
