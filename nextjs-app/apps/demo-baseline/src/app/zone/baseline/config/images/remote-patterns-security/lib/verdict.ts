import type { ComputedImgProps, DomSnapshot, ProbeOutcome } from '../types'
import { SAMPLE_PATH } from './constants'

export interface Check {
  label: string
  expected: string
  actual: string
  ok: boolean
}

/**
 * 현재 설정(images.unoptimized: true)에서 실제로 잴 수 있는 값만 판정한다.
 * remotePatterns가 적용됐을 때의 400은 이 앱에서 나올 수 없으므로 판정 항목에 넣지 않는다.
 */
export function buildChecks(outcome: ProbeOutcome, dom: DomSnapshot | null, computed: ComputedImgProps[]): Check[] {
  const checks: Check[] = []
  if (outcome.ok) {
    for (const r of outcome.results) {
      checks.push({
        label: `/_next/image — ${r.label}`,
        expected: '404 (최적화 라우트 없음, 400 거절 단계에 도달하지 않음)',
        actual: `${r.status} · ${r.contentType ?? 'Content-Type 없음'}${r.textBody ? ` · "${r.textBody}"` : ''}`,
        ok: r.status === 404,
      })
    }
  } else {
    checks.push({ label: '/_next/image 요청', expected: '응답 수신', actual: `측정 실패: ${outcome.error}`, ok: false })
  }
  for (const c of computed) {
    checks.push({
      label: `getImageProps() — ${c.label}`,
      expected: `src = 입력 그대로, srcSet 없음`,
      actual: `src = ${c.src} · srcSet ${c.srcSet ?? '없음'}`,
      ok: c.src === c.input && c.srcSet === null,
    })
  }
  checks.push({
    label: '렌더된 <img> DOM',
    expected: `src 속성 = ${SAMPLE_PATH}, srcset 없음, 원본 640px`,
    actual: dom
      ? `src = ${dom.srcAttr ?? '없음'} · srcset ${dom.srcsetAttr ?? '없음'} · currentSrc 경로 ${dom.currentPath} · ${dom.naturalWidth}px`
      : '이미지가 아직 로드되지 않았습니다',
    ok: dom !== null && dom.srcAttr === SAMPLE_PATH && dom.srcsetAttr === null && dom.naturalWidth === 640,
  })
  return checks
}
