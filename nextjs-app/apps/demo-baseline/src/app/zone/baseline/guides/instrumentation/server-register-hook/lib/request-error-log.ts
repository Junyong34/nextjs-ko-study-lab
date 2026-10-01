import type { CapturedRequestError } from '../types'

// src/instrumentation.ts의 onRequestError는 '[Instrumentation:onRequestError]' 접두사로 console.error를 남길 뿐
// 값을 돌려주지 않는다. instrumentation.ts를 고치지 않고 그 호출을 화면에서 확인하려고,
// 이 데모의 api/fail 모듈이 처음 로드될 때 console.error를 한 번 감싸 그 접두사 로그만 따로 모은다.
// 원래 console.error는 그대로 호출하므로 터미널 출력과 다른 페이지 동작은 바뀌지 않는다.
const PREFIX = '[Instrumentation:onRequestError]'
const MAX = 20

interface Store {
  installed: boolean
  entries: CapturedRequestError[]
}

declare global {
  // eslint-disable-next-line no-var
  var __guidesRegisterHookErrorLog: Store | undefined
}

function store(): Store {
  return (globalThis.__guidesRegisterHookErrorLog ??= { installed: false, entries: [] })
}

export function installRequestErrorCapture() {
  const s = store()
  if (s.installed) return
  s.installed = true
  const original = console.error.bind(console)
  console.error = (...args: unknown[]) => {
    if (args[0] === PREFIX && typeof args[1] === 'object' && args[1] !== null) {
      const p = args[1] as { message?: string; path?: string; context?: { routeType?: string; routePath?: string } }
      s.entries = [
        {
          message: p.message ?? '',
          path: p.path ?? '',
          routeType: p.context?.routeType ?? '',
          routePath: p.context?.routePath ?? '',
          capturedAt: new Date().toISOString(),
        },
        ...s.entries,
      ].slice(0, MAX)
    }
    original(...args)
  }
}

export const readRequestErrors = () => store().entries
