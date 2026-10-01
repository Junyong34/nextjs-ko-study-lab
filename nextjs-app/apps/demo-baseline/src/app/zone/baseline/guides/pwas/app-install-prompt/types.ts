// BeforeInstallPromptEvent는 표준 lib.dom.d.ts에 없는 Chromium 계열 이벤트다.
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

/** 마운트 시점에 브라우저에서 직접 읽은 설치 관련 신호. */
export interface EnvSignals {
  isSecureContext: boolean
  hasServiceWorkerApi: boolean
  hasInstallPromptHook: boolean
  inFrame: boolean
  isIos: boolean
}

export interface LogEntry {
  at: string
  name: string
  detail?: string
}

export interface Check {
  id: string
  label: string
  ok: boolean
  detail: string
}

/** fetch로 읽은 실제 manifest 응답과 항목별 검사 결과. */
export interface ManifestReport {
  linkHref: string | null
  status: number | null
  contentType: string | null
  checks: Check[]
  allOk: boolean
}

export interface ActionResult {
  ok: boolean
  detail: string
}

export interface SwSnapshot {
  scope: string | null
  state: string | null
  controlled: boolean
}
