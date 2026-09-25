// server-boot-log 데모(/zone/baseline/file-conventions/instrumentation/server-boot-log)가 읽는 부팅 스냅샷 타입.
// register()는 새 서버 인스턴스가 시작될 때 정확히 1회만 호출되므로, 여기 기록된 값은 이후 요청·페이지
// 새로고침으로는 절대 갱신되지 않는다 — globalThis에 저장해 라우트 핸들러 등 다른 모듈에서도 같은 프로세스
// 안에서 동일한 값을 읽게 한다(모듈 스코프 변수는 번들러가 파일별로 별도 인스턴스를 만들 수 있어 불안정하다).
export interface ServerBootLogSnapshot {
  bootedAt: string
  bootedAtMs: number
  runtime: 'nodejs' | 'edge'
  pid: number
  nodeVersion: string
  registerCallCount: number
}

declare global {
  // eslint-disable-next-line no-var
  var __serverBootLogSnapshot: ServerBootLogSnapshot | undefined
}

export async function register() {
  // Next.js 서버 부트스트랩 시 1회 실행되는 인스트루멘테이션 라이프사이클 훅
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.info('[Instrumentation] Next.js 16 App Router Node.js 런타임 부팅 완료 (텔레메트리 활성화)')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    console.info('[Instrumentation] Next.js 16 App Router Edge 런타임 초기화 완료')
  }

  // 1. server-boot-log 데모: 부팅 시각/런타임 정보를 globalThis 싱글턴에 기록.
  //    기존 스냅샷이 있으면 bootedAt(원본 부팅 시각)은 절대 덮어쓰지 않고 registerCallCount만 증가시킨다 —
  //    데모가 검증하는 것은 "register()가 몇 번 호출됐는가"이지 이 값을 매번 새로 쓰는 것이 아니다.
  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
    const runtime = process.env.NEXT_RUNTIME
    const previous = globalThis.__serverBootLogSnapshot
    globalThis.__serverBootLogSnapshot = {
      bootedAt: previous?.bootedAt ?? new Date().toISOString(),
      bootedAtMs: previous?.bootedAtMs ?? Date.now(),
      runtime,
      pid: typeof process.pid === 'number' ? process.pid : -1,
      nodeVersion: process.version ?? 'unknown',
      registerCallCount: (previous?.registerCallCount ?? 0) + 1,
    }
    console.info('[Instrumentation:server-boot-log]', globalThis.__serverBootLogSnapshot)
  }
}

// server-boot-log 데모 전용 리더. register()가 기록한 globalThis 싱글턴을 그대로 반환하므로,
// 이 함수를 호출한다고 register()가 다시 실행되지는 않는다.
export function getServerBootLogSnapshot(): ServerBootLogSnapshot | undefined {
  return globalThis.__serverBootLogSnapshot
}

export async function onRequestError(
  err: { digest?: string } & Error,
  request: {
    path: string
    method: string
    headers: Record<string, string>
  },
  context: {
    routerKind: 'Pages Router' | 'App Router'
    routePath: string
    routeType: 'render' | 'route' | 'action' | 'middleware'
    renderSource?: 'react-server-components' | 'react-server-components-payload' | 'server-rendering'
  }
) {
  // 서버 렌더링, 라우트 핸들러, 서버 액션 중 발생한 모든 런타임 에러 캡처 훅
  console.error('[Instrumentation:onRequestError]', {
    message: err.message,
    digest: err.digest,
    path: request.path,
    method: request.method,
    context,
    timestamp: new Date().toISOString(),
  })
}
