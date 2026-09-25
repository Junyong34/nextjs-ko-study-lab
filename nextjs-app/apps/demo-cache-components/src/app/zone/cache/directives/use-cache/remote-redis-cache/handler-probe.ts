import type { HandlerIdentityProbe } from './types'

/**
 * next@16.3.2가 use-cache 핸들러 레지스트리를 저장하는 실제 위치.
 * node_modules/next/dist/server/use-cache/handlers.js의 `handlersMapSymbol` 상수와 같은 값이다.
 * 공개 API가 아니라 이 앱이 고정한 Next.js 버전에서만 유효하다고 가정하는 내부 상태 — 그래서
 * 아래 함수는 이 심볼을 찾지 못하면(버전이 바뀌어 구조가 달라지면) 에러 대신 initialized:false를
 * 반환하도록 방어적으로 작성했다.
 */
const HANDLERS_MAP_SYMBOL = Symbol.for('@next/cache-handlers-map')

// 핸들러 객체 자체를 화면에 노출하지 않고, 처음 본 순서대로 짧은 표시용 id만 부여한다.
const displayIdByHandler = new WeakMap<object, string>()
let nextDisplaySeq = 1

function displayIdFor(handler: object): string {
  const existing = displayIdByHandler.get(handler)
  if (existing) return existing
  const id = `handler#${nextDisplaySeq++}`
  displayIdByHandler.set(handler, id)
  return id
}

/**
 * 'default' 캐시 핸들러와 'remote' 캐시 핸들러가 실제로 같은 객체 인스턴스인지 확인한다.
 * next.config.ts에 cacheHandlers.remote를 등록하지 않은 이 앱에서는 Next.js가 두 키를
 * 같은 내장 in-memory 핸들러에 연결하므로 sameInstance는 true가 나온다.
 * (cacheHandlers.remote를 등록하면 이 값은 false가 된다 — 이 데모가 검증하는 바로 그 차이다.)
 */
export function probeCacheHandlerIdentity(): HandlerIdentityProbe {
  const globalRef = globalThis as unknown as Record<symbol, unknown>
  const handlersMap = globalRef[HANDLERS_MAP_SYMBOL]

  if (!(handlersMap instanceof Map)) {
    return { initialized: false, sameInstance: null, defaultHandlerId: null, remoteHandlerId: null }
  }

  const defaultHandler = handlersMap.get('default')
  const remoteHandler = handlersMap.get('remote')

  if (!defaultHandler || !remoteHandler) {
    return { initialized: false, sameInstance: null, defaultHandlerId: null, remoteHandlerId: null }
  }

  return {
    initialized: true,
    sameInstance: Object.is(defaultHandler, remoteHandler),
    defaultHandlerId: displayIdFor(defaultHandler as object),
    remoteHandlerId: displayIdFor(remoteHandler as object),
  }
}
