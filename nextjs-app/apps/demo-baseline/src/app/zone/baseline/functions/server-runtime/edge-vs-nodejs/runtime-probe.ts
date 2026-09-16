import type { DeclaredRuntime, NodeApiProbeResult, RuntimeProbeResponse } from './types'

// 정적 import 대신 동적 import를 쓴다 — edge 런타임 세그먼트에서 `import 'node:fs'`를
// 파일 최상단에 정적으로 적으면 번들러가 아예 이 라우트를 edge용으로 컴파일하지 못한다.
// import 대상 문자열은 번들러가 정적 분석할 수 있도록 각 함수에 리터럴로 직접 적는다
// (변수로 넘기면 "expression is too dynamic" 번들러 오류가 나 두 런타임 모두에서 깨진다).
// 성공/실패, 에러 메시지를 실측해 그대로 응답에 담는다.
async function probeNodeFs(): Promise<NodeApiProbeResult> {
  // 경로를 'package.json' 리터럴로 고정한다 — process.cwd() 등 동적 경로를 쓰면
  // Turbopack이 "전체 프로젝트를 추적 대상에 포함시킨다"는 별도 빌드 경고를 낸다.
  const api = "node:fs.readFileSync('package.json')"
  try {
    const fs = await import('node:fs')
    const raw = fs.readFileSync('package.json', 'utf-8')
    const { name } = JSON.parse(raw) as { name?: string }
    return { api, ok: true, value: `package.json name 필드 읽음: ${name ?? '(없음)'}` }
  } catch (error) {
    return { api, ok: false, errorMessage: error instanceof Error ? error.message : String(error) }
  }
}

async function probeNodeCrypto(): Promise<NodeApiProbeResult> {
  const api = 'node:crypto.randomBytes(4)'
  try {
    const crypto = await import('node:crypto')
    const bytes = crypto.randomBytes(4)
    return { api, ok: true, value: bytes.toString('hex') }
  } catch (error) {
    return { api, ok: false, errorMessage: error instanceof Error ? error.message : String(error) }
  }
}

export async function buildRuntimeProbeResponse(declaredRuntime: DeclaredRuntime): Promise<RuntimeProbeResponse> {
  const fsProbe = await probeNodeFs()
  const cryptoProbe = await probeNodeCrypto()

  return {
    declaredRuntime,
    // Next.js가 실제로 주입하는 실행 환경 값 — instrumentation.ts 공식 문서에서도
    // 이 값으로 'nodejs' | 'edge'를 분기하도록 안내한다.
    runtimeEnv: process.env.NEXT_RUNTIME ?? null,
    nodeApiProbes: [fsProbe, cryptoProbe],
    receivedAt: new Date().toISOString(),
  }
}
