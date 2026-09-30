import type { ProbeResult, ProbeTarget } from './types'

export interface Judgement {
  /** undefined = 아직 두 라우트를 모두 호출하지 않음(대기) */
  isMatched: boolean | undefined
  expected: string[]
  actual: string[]
  description: string
}

const line = (r: ProbeResult) =>
  r.status !== 'ok'
    ? r.status === 'error'
      ? `호출 실패: ${r.message}`
      : '미호출'
    : `NEXT_RUNTIME=${r.data.nextRuntime}, ok=${r.data.ok}, moduleBlocked=${r.data.moduleBlocked}` +
      (r.data.ok ? `, ${r.data.file} ${r.data.bytes}B` : `, ${r.data.errorName}: ${r.data.errorMessage}`)

/**
 * 두 Route Handler가 돌려준 실측값만으로 판정한다.
 * 기대: node는 fs로 파일을 읽고, edge는 fs 모듈을 불러오는 단계에서 막힌다.
 * target=missing이면 node도 ENOENT로 실패하므로 기대와 어긋나 '불일치'가 된다(다른 종류의 실패).
 */
export function judge(node: ProbeResult, edge: ProbeResult, target: ProbeTarget): Judgement {
  const expected = [
    'node 라우트: NEXT_RUNTIME=nodejs, ok=true (fs로 package.json을 읽음)',
    'edge 라우트: NEXT_RUNTIME=edge, ok=false, moduleBlocked=true (fs 모듈 자체를 불러오지 못함)',
  ]
  const actual = [`node → ${line(node)}`, `edge → ${line(edge)}`]
  if (node.status !== 'ok' || edge.status !== 'ok') {
    const pending = node.status === 'loading' || edge.status === 'loading'
    const failed = node.status === 'error' || edge.status === 'error'
    return {
      isMatched: failed ? false : undefined,
      expected,
      actual,
      description: failed
        ? '라우트 호출 자체가 실패했습니다. dev 서버와 경로를 확인하세요.'
        : pending
          ? '호출 중입니다.'
          : '대기 중: [Node.js 라우트 호출]과 [Edge 라우트 호출]을 모두 눌러 실측값을 채워 주세요.',
    }
  }
  const matched =
    node.data.nextRuntime === 'nodejs' &&
    node.data.ok &&
    edge.data.nextRuntime === 'edge' &&
    !edge.data.ok &&
    edge.data.moduleBlocked
  return {
    isMatched: matched,
    expected,
    actual,
    description: matched
      ? '같은 코드가 nodejs에서는 fs를 쓰고 edge에서는 fs를 불러오지 못했습니다.'
      : target === 'missing'
        ? '없는 파일을 골랐습니다. node의 실패는 ENOENT(파일 없음)이고 edge의 실패(모듈 차단)와 원인이 다릅니다.'
        : '기대와 다른 실측값입니다. runtime export와 결과의 nextRuntime을 확인하세요.',
  }
}
