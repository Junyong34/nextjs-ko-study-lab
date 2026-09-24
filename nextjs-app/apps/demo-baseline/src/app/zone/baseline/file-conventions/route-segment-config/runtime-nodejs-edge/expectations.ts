import type { ProbeSegment, RuntimeProbe } from './types'

type ProbeField = Exclude<keyof RuntimeProbe, 'measuredAt'>

export interface ProbeRowSpec {
  field: ProbeField
  label: string
  /** 공식 문서 기준 기대값을 사람이 읽을 수 있게 적은 것 (세그먼트별) */
  expected: Record<ProbeSegment, string>
  /** 실측값이 기대에 맞는지 판정 */
  check: (segment: ProbeSegment, probe: RuntimeProbe) => boolean
}

const isEdge = (segment: ProbeSegment) => segment === 'edge'

export const PROBE_ROWS: ProbeRowSpec[] = [
  {
    field: 'nextRuntime',
    label: 'process.env.NEXT_RUNTIME',
    expected: { default: "'nodejs'", node: "'nodejs'", edge: "'edge'" },
    check: (s, p) => p.nextRuntime === (isEdge(s) ? 'edge' : 'nodejs'),
  },
  {
    field: 'edgeRuntimeGlobal',
    label: 'typeof EdgeRuntime',
    expected: { default: "'undefined'", node: "'undefined'", edge: "'string'" },
    check: (s, p) => p.edgeRuntimeGlobal === (isEdge(s) ? 'string' : 'undefined'),
  },
  {
    field: 'nodeVersion',
    label: 'process.versions?.node',
    expected: { default: 'Node 버전 문자열', node: 'Node 버전 문자열', edge: 'null (없음)' },
    check: (s, p) => (isEdge(s) ? p.nodeVersion === null : typeof p.nodeVersion === 'string'),
  },
  {
    field: 'fsAccess',
    label: "getBuiltinModule('node:fs')",
    expected: { default: 'ok (fs 사용 가능)', node: 'ok (fs 사용 가능)', edge: '사용 불가 / 예외' },
    check: (s, p) => (isEdge(s) ? !p.fsAccess.startsWith('ok') : p.fsAccess.startsWith('ok')),
  },
  {
    field: 'webApis',
    label: 'fetch / Response / crypto.subtle',
    expected: { default: '모두 존재', node: '모두 존재', edge: '모두 존재 (대조군)' },
    check: (_s, p) => p.webApis === 'fetch:function, Response:function, crypto.subtle:object',
  },
]

/** 한 세그먼트의 모든 행이 기대와 일치하는지 */
export function segmentMatches(segment: ProbeSegment, probe: RuntimeProbe): boolean {
  return PROBE_ROWS.every((row) => row.check(segment, probe))
}
