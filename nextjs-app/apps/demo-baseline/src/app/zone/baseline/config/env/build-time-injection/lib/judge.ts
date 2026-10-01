import { DECLARED_KEY, UNDECLARED_KEY } from '../types'
import type { ProbeSnapshot } from '../hooks/useInjectionProbe'

export interface Check {
  label: string
  ok: boolean
  detail: string
}

const show = (v: string | null) => (v === null ? 'undefined' : `"${v}"`)

/** 측정값만으로 판정한다. expected는 서버(page.tsx)가 설정 모듈에서 읽어 넘긴 선언값이다. */
export function judge(s: ProbeSnapshot, expected: string): Check[] {
  const find = (rs: ProbeSnapshot['browser'], key: string) => rs.find((r) => r.key === key)!
  const sd = find(s.server.readings, DECLARED_KEY)
  const bd = find(s.browser, DECLARED_KEY)
  const su = find(s.server.readings, UNDECLARED_KEY)
  const bu = find(s.browser, UNDECLARED_KEY)
  const c = s.chunks
  return [
    { label: '서버 점 접근', ok: sd.dot === expected, detail: `선언 키 ${show(sd.dot)}` },
    { label: '브라우저 점 접근', ok: bd.dot === expected, detail: `선언 키 ${show(bd.dot)} (NEXT_PUBLIC_ 접두사 없음)` },
    { label: '서버 동적 접근', ok: sd.dynamic === null, detail: `process.env[key] → ${show(sd.dynamic)}` },
    { label: '브라우저 동적 접근', ok: bd.dynamic === null, detail: `process.env[key] → ${show(bd.dynamic)}` },
    { label: '선언하지 않은 키', ok: su.dot === null && bu.dot === null, detail: `서버 ${show(su.dot)} / 브라우저 ${show(bu.dot)}` },
    {
      label: '클라이언트 청크 실측',
      ok: c.failedFiles === 0 && c.filesWithValue.length > 0 && c.filesWithRawIdentifier.length === 0,
      detail: `JS ${c.scannedFiles}개 중 값 포함 ${c.filesWithValue.length}개, 치환 안 된 식별자 ${c.filesWithRawIdentifier.length}개${c.failedFiles ? `, 읽기 실패 ${c.failedFiles}개` : ''}`,
    },
  ]
}
