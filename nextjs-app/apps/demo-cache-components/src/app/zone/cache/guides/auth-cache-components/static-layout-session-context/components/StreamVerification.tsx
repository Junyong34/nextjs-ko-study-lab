'use client'

import { ExpectedActualPanel, DemoResetButton } from '@study/demo-kit'
import { useStreamProbe } from '../hooks/useStreamProbe'
import type { StreamProbeRun } from '../types'

function at(v: StreamProbeRun['shellAt']) {
  return v ? `${v.offset}자 (청크#${v.chunk}·${v.ms}ms)` : '없음'
}

/**
 * 한 번의 응답에서: 셸과 fallback이 HTML 앞부분에 있고, 세션 마크업은 그 뒤
 * 스트리밍 세그먼트(<div hidden id="S:n">)로 따로 도착했는가.
 * 청크 경계는 네트워크 버퍼링에 따라 합쳐질 수 있어 판정에는 바이트 순서를 쓴다.
 */
function isStreamed(run: StreamProbeRun) {
  const { shellAt, fallbackAt, sessionAt, sessionInStreamSegment } = run
  return Boolean(
    shellAt && fallbackAt && sessionAt && sessionInStreamSegment &&
      shellAt.offset < sessionAt.offset && fallbackAt.offset < sessionAt.offset,
  )
}

export function StreamVerification() {
  const { runs, running, error, probe, reset } = useStreamProbe()

  const latest = runs.at(-1)
  const shellIds = new Set(runs.map((r) => r.shellRenderId))
  const sessionIds = new Set(runs.map((r) => r.sessionRequestId))
  const users = new Set(runs.map((r) => r.sessionUser))

  const streamedOk = latest ? isStreamed(latest) : false
  const shellFixed = runs.length >= 2 && shellIds.size === 1 && !shellIds.has(null)
  const sessionFresh = runs.length >= 2 && sessionIds.size === runs.length && !sessionIds.has(null)
  const userChanged = users.has('guest') && users.size >= 2

  const isMatched =
    runs.length < 2 ? undefined : streamedOk && shellFixed && sessionFresh && userChanged

  const expected = (
    <span>
      {'1) 셸·fallback이 HTML 앞부분에, 세션은 뒤쪽 스트리밍 세그먼트(S:n)로 도착\n'}
      {'2) 모든 측정에서 셸 렌더 ID 동일 (static shell 재사용)\n'}
      {'3) 세션 요청 ID는 측정마다 다름 (요청 시점 스트리밍)\n'}
      {'4) 로그인 전(guest)과 후(사용자 이름)가 모두 관측됨'}
    </span>
  )

  const actual = (
    <span>
      {runs.length === 0
        ? '측정 대기 중 — [초기 HTML 응답 측정]을 눌러 주세요.'
        : [
            `1) 최근 측정: 셸 ${at(latest!.shellAt)}, fallback ${at(latest!.fallbackAt)}, 세션 ${at(latest!.sessionAt)} → ${streamedOk ? '세션만 S:n 세그먼트로 스트리밍' : '분리 안 됨 (fallback 없음 또는 인라인 렌더)'}`,
            `2) 셸 렌더 ID 종류 ${shellIds.size}개 (${[...shellIds].join(', ')}) → ${shellFixed ? '고정' : runs.length < 2 ? '측정 2회 이상 필요' : '변경됨'}`,
            `3) 세션 요청 ID ${sessionIds.size}/${runs.length}개 고유 → ${sessionFresh ? '요청마다 새로 읽음' : runs.length < 2 ? '측정 2회 이상 필요' : '중복 있음'}`,
            `4) 관측된 사용자: ${[...users].join(', ')} → ${userChanged ? '로그인 전후 변화 확인' : '로그인 전후 측정 필요'}`,
          ].join('\n')}
    </span>
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={probe}
          disabled={running}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {running ? '응답 읽는 중...' : '초기 HTML 응답 측정'}
        </button>
        <DemoResetButton label="측정 기록 초기화" onReset={reset} />
        {error && <span className="text-xs text-rose-600 dark:text-rose-400">측정 실패: {error}</span>}
      </div>

      {runs.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[44rem] text-left font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900/60 dark:text-zinc-400">
              <tr>
                {['#', '셸 위치', 'fallback 위치', '세션 위치', 'S:n', '셸 렌더 ID', '세션 요청 ID', '사용자'].map((h) => (
                  <th key={h} className="px-2 py-1.5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.runNo} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="px-2 py-1.5">{r.runNo}</td>
                  <td className="px-2 py-1.5">{at(r.shellAt)}</td>
                  <td className="px-2 py-1.5">{at(r.fallbackAt)}</td>
                  <td className="px-2 py-1.5">{at(r.sessionAt)}</td>
                  <td className="px-2 py-1.5">{r.sessionInStreamSegment ? '예' : '아니오'}</td>
                  <td className="px-2 py-1.5">{r.shellRenderId ?? '-'}</td>
                  <td className="px-2 py-1.5">{r.sessionRequestId ?? '-'}</td>
                  <td className="px-2 py-1.5">{r.sessionUser ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ExpectedActualPanel
        title="정적 셸 선전송 + 세션 스트리밍"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="현재 페이지 URL을 fetch해 응답 body를 스트림으로 읽고, 각 마커의 HTML 내 위치·청크 번호·도착 시각과 세션 마크업이 스트리밍 세그먼트(숨김 div, id S:n)에 실려 왔는지 기록합니다. 로그인 전에 1회 이상, 로그인 후 1회 이상 측정하세요."
      />
    </div>
  )
}
