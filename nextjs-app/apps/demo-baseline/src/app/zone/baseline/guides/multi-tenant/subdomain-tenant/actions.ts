'use server'
import { getScenario } from './lib/scenarios'
import { requestTenantRoute } from './lib/selfRequest'
import type { ProbeResult } from './types'

/**
 * 클라이언트는 시나리오 id 만 보낸다. 호스트 값과 전송 방식은 서버가 화이트리스트에서 고른다.
 * 브라우저는 Host 헤더를 바꿀 수 없으므로 서버 측에서 같은 앱의 Route Handler 를 호출한다.
 */
export async function runScenario(scenarioId: string): Promise<ProbeResult> {
  const scenario = getScenario(scenarioId)
  if (!scenario) return { scenarioId, sent: {}, status: null, body: null, error: '알 수 없는 시나리오' }
  try {
    const { sent, status, body } = await requestTenantRoute(scenario.transport, scenario.host)
    return { scenarioId, sent, status, body, error: null }
  } catch (e) {
    return { scenarioId, sent: {}, status: null, body: null, error: e instanceof Error ? e.message : String(e) }
  }
}
