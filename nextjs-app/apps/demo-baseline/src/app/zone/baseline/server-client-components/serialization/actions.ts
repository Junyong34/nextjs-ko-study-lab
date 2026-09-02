'use server'

/**
 * Server Action:
 * 일반 서버 함수는 RSC 경계를 통과할 수 없지만,
 * 'use server'로 선언된 Server Action은 고유 Action ID로 직렬화되어
 * Client Component의 Props로 안전하게 전달 및 실행될 수 있습니다.
 */
export async function executeServerTask(input: string) {
  const startTime = performance.now()
  const processedAt = new Date().toLocaleTimeString('ko-KR')
  const serverTimestamp = new Date().toISOString()
  const elapsedMs = Math.max(1, Math.round(performance.now() - startTime))

  return {
    success: true,
    inputMessage: input,
    serverTimestamp,
    serverTime: processedAt,
    serverRuntime: 'Node.js (Next.js Server Action RPC Engine)',
    actionId: '$$typeof: Symbol(react.action.id) #executeServerTask',
    result: `[서버 처리 성공] "${input}" 요청이 서버에서 정상 처리되었습니다. (응답 시각: ${processedAt})`,
  }
}
