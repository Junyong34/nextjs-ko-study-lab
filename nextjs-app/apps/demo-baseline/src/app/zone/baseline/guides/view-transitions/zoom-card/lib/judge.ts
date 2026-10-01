import type { CheckLine, EnvInfo, Judgement, TransitionRecord } from '../types'

interface Input {
  env: EnvInfo | null
  transitions: TransitionRecord[]
  navigationCount: number
}

const SHARED = /^::view-transition-(group|image-pair|old|new)\((zoom-card-\d+)\)$/

/** 한 전환의 pseudo 애니메이션에서 old·new 쌍이 모두 있는 공유 name 목록 */
export function pairedNames(t: TransitionRecord): string[] {
  const seen = new Map<string, Set<string>>()
  for (const a of t.animations) {
    const m = SHARED.exec(a.pseudo)
    if (m) seen.set(m[2], (seen.get(m[2]) ?? new Set()).add(m[1]))
  }
  return [...seen].filter(([, kinds]) => kinds.has('old') && kinds.has('new') && kinds.has('group')).map(([name]) => name)
}

function summarize(checks: CheckLine[]): boolean | undefined {
  if (checks.some((c) => c.ok === false)) return false
  if (checks.some((c) => c.ok === null)) return undefined
  return true
}

export function judge({ env, transitions, navigationCount }: Input): Judgement {
  if (!env || navigationCount === 0) return { isMatched: undefined, checks: [] }

  // 미지원 브라우저: 전환 없이도 이동은 정상 완료되어야 한다 (폴백).
  if (!env.supported) {
    const checks: CheckLine[] = [
      { ok: true, text: `document.startViewTransition 미지원 — 이동 ${navigationCount}회가 애니메이션 없이 완료됨 (폴백 정상)` },
      { ok: transitions.length === 0, text: `기록된 전환 ${transitions.length}건 (기대: 0건)` },
    ]
    return { isMatched: summarize(checks), checks }
  }

  const last = transitions[transitions.length - 1]
  const checks: CheckLine[] = [
    {
      ok: transitions.length >= navigationCount,
      text: `이동 ${navigationCount}회 → document.startViewTransition 호출 ${transitions.length}회 (기대: 이동마다 1회 이상)`,
    },
  ]
  if (last) {
    const names = pairedNames(last)
    const settled = last.ready !== 'pending'
    checks.push(
      { ok: settled ? last.ready === 'resolved' : null, text: `마지막 전환 ready: ${last.ready}, types: [${last.types.join(', ')}]` },
      {
        ok: settled ? names.length > 0 : null,
        text: settled
          ? `공유 name old·new·group pseudo 쌍: ${names.length ? names.join(', ') : '없음'} (morph 쌍이 만들어졌는가)`
          : '공유 pseudo 쌍 측정 대기 중...',
      },
    )
  }
  return { isMatched: summarize(checks), checks }
}
