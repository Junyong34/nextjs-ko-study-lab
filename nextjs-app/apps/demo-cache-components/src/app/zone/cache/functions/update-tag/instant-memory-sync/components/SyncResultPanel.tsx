'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { LineView, SyncRun } from '../types'

const TITLE = '변경 직후 응답에서 내 변경이 보이는가 (read-your-own-writes)'

/** 화면의 캐시 값이 내 쓰기 이후에 계산된 엔트리인가 */
function seesOwnWrite(view: LineView | undefined, run: SyncRun) {
  if (!view || !run.result) return false
  return view.cached.generatedAtMs >= run.result.writtenAtMs && view.cached.qty === run.result.qtyAfterWrite
}

/** 액션 응답에 이 페이지의 새 렌더가 실려 왔는가 (원본 칸이 내 쓰기 시각으로 바뀌었는가) */
function actionRerendered(run: SyncRun) {
  return Boolean(run.afterAction && run.result && run.afterAction.source.updatedAtMs === run.result.writtenAtMs)
}

export function evaluate(run: SyncRun) {
  if (run.phase !== 'done' || !run.result || !run.afterAction || !run.afterRefresh) return null
  const rerendered = actionRerendered(run)
  const ownInAction = seesOwnWrite(run.afterAction, run)
  const ownInRefresh = seesOwnWrite(run.afterRefresh, run)
  const refreshSawWrite = run.afterRefresh.source.updatedAtMs === run.result.writtenAtMs
  const matched =
    run.api === 'updateTag'
      ? rerendered && ownInAction && ownInRefresh
      : !rerendered && refreshSawWrite && !ownInRefresh
  return { rerendered, ownInAction, ownInRefresh, matched }
}

function expectedText(run: SyncRun) {
  return run.api === 'updateTag'
    ? '액션 응답에 새 렌더가 실려 온다\n- 캐시 엔트리가 쓰기 이후 재계산됨 (새 cacheId)\n- 캐시 수량 = 원본 쓰기 결과 → 내 변경이 바로 보임'
    : "액션 응답에 새 렌더가 실리지 않는다 (SWR)\n- 이어진 첫 재요청: 원본은 새 값, 캐시는 쓰기 이전에 계산된 stale 엔트리\n- 캐시 수량 ≠ 원본 → 내 변경이 아직 안 보임"
}

function line(label: string, view: LineView | undefined) {
  if (!view) return `${label}: -`
  const c = view.cached
  return `${label}: 캐시 ${c.qty}개 #${c.cacheId} (생성 ${c.generatedAt}) · 원본 ${view.source.qty}개`
}

function actualText(run: SyncRun, v: NonNullable<ReturnType<typeof evaluate>>) {
  return [
    `원본 쓰기: ${run.before.source.qty} → ${run.result!.qtyAfterWrite}개 (${run.result!.writtenAt})`,
    line('클릭 전', run.before),
    `${line('액션 응답 직후', run.afterAction)} → 새 렌더 ${v.rerendered ? '수신' : '없음'}`,
    `${line('첫 재요청', run.afterRefresh)} → 내 변경 ${v.ownInRefresh ? '보임' : '안 보임(stale)'}`,
  ].join('\n')
}

export function SyncResultPanel({ runs }: { runs: SyncRun[] }) {
  const current = runs[0]
  const verdict = current ? evaluate(current) : null

  return (
    <div className="space-y-3">
      {!current || !verdict ? (
        // 문자열 expected/actual + isMatched undefined 조합은 demo-kit이 "불일치"로 오판하므로 JSX로 감싼다
        <ExpectedActualPanel
          title={TITLE}
          description={current && !current.error ? '측정 중입니다: 액션 응답 → 첫 재요청 순서로 화면 값을 기록합니다.' : '위 장바구니에서 두 상품의 +/− 버튼을 각각 눌러 비교해 주세요.'}
          expected={<span>updateTag 줄은 액션 응답에서 바로 원본과 같은 수량이 보이고, revalidateTag(tag, &apos;max&apos;) 줄은 첫 재요청에서도 이전 수량(stale)이 보인다.</span>}
          actual={<span>{current?.error ? `액션 오류: ${current.error}` : current ? '측정 중...' : '아직 측정한 수량 변경이 없습니다.'}</span>}
          isMatched={undefined}
        />
      ) : (
        <ExpectedActualPanel
          title={TITLE}
          description={`${current.api}: 클릭 전 → 액션 응답 직후 → 첫 재요청(router.refresh) 순서로 서버가 그린 값을 기록했습니다.`}
          expected={<span>{expectedText(current)}</span>}
          actual={<span>{actualText(current, verdict)}</span>}
          isMatched={verdict.matched}
        />
      )}

      {runs.some((r) => r.phase === 'done' && !r.error) && (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-zinc-50 font-sans text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-2 py-1.5">API</th>
                <th className="px-2 py-1.5">원본 쓰기</th>
                <th className="px-2 py-1.5">액션 응답 렌더</th>
                <th className="px-2 py-1.5">첫 재요청 캐시 수량</th>
                <th className="px-2 py-1.5">내 변경이 보임</th>
              </tr>
            </thead>
            <tbody className="text-zinc-800 dark:text-zinc-200">
              {runs.map((run) => {
                const v = evaluate(run)
                if (!v) return null
                return (
                  <tr key={run.id} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="px-2 py-1.5">{run.api}</td>
                    <td className="px-2 py-1.5">{`${run.before.source.qty}→${run.result!.qtyAfterWrite}`}</td>
                    <td className="px-2 py-1.5">{v.rerendered ? `수신 (캐시 ${run.afterAction!.cached.qty}개)` : '없음'}</td>
                    <td className="px-2 py-1.5">{`${run.afterRefresh!.cached.qty}개 #${run.afterRefresh!.cached.cacheId}`}</td>
                    <td className={`px-2 py-1.5 ${v.ownInRefresh ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {v.ownInRefresh ? '예' : '아니오 (stale)'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
