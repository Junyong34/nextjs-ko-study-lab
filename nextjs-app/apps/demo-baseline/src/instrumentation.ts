export async function register() {
  // Next.js 서버 부트스트랩 시 1회 실행되는 인스트루멘테이션 라이프사이클 훅
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.info('[Instrumentation] Next.js 16 App Router Node.js 런타임 부팅 완료 (텔레메트리 활성화)')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    console.info('[Instrumentation] Next.js 16 App Router Edge 런타임 초기화 완료')
  }
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
