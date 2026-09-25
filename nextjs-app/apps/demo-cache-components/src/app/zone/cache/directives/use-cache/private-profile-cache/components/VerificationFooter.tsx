'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { viewerName, VIEWS } from '../types'
import { evaluate } from './evaluate'
import { useObservations } from './ObservationContext'

const routeLabel = (id: string) => VIEWS.find((v) => v.id === id)?.label ?? id

export function VerificationFooter() {
  const { visits, execChecks, probe } = useObservations()
  const { reuse, noServerExec, execDuringReuse, reloadFresh, persisted, viewers, crossShared, isolated, probeRejected, isMatched } =
    evaluate(visits, probe, execChecks)

  const expected = (
    <span>
      {'• 탭을 오가도(같은 문서): 같은 사용자·같은 탭은 cacheId 그대로 (브라우저 메모리 재사용, 서버 실행 없음)\n'}
      {'• 새로고침(F5) 후: 같은 사용자·같은 탭이라도 새 cacheId (서버에도 브라우저에도 남지 않음)\n'}
      {'• 사용자 전환: 다른 사용자는 절대 같은 cacheId를 받지 않음 (사용자 간 공유 없음)\n'}
      {"• 대조군: 일반 'use cache' 안의 cookies()는 오류로 거부됨"}
    </span>
  )

  const actual = (
    <span>
      {visits.length === 0 && '• 관측 대기 중 (탭이 화면에 나타날 때마다 기록됩니다)\n'}
      {reuse
        ? `• 재사용 확인: ${routeLabel(reuse[0].route)} #${reuse[0].seq} → 다른 탭 → #${reuse[1].seq} 모두 cacheId #${reuse[0].cacheId} (본문 실행 ${reuse[0].generatedAt})\n`
        : '• 재사용: 아직 다른 탭을 거쳐 같은 탭으로 돌아오지 않았습니다\n'}
      {execDuringReuse
        ? `• 불일치: 재사용 표시 전후 서버 실행 횟수 ${execDuringReuse[0].count}회 → ${execDuringReuse[1].count}회 (서버가 다시 실행함)\n`
        : noServerExec
          ? `• 서버 미실행 확인: 재사용 표시 전후 조회 ${noServerExec[0].checkedAt} → ${noServerExec[1].checkedAt} 모두 ${noServerExec[0].count}회\n`
          : '• 서버 실행 횟수: 재사용 탭 이동 전후로 [서버 실행 횟수 조회]를 눌러 비교합니다\n'}
      {persisted
        ? `• 불일치: 새로고침 전후 기록 #${persisted[0].seq}·#${persisted[1].seq}가 같은 cacheId #${persisted[0].cacheId}\n`
        : reloadFresh
          ? `• 새로고침 후 새 값: ${routeLabel(reloadFresh[0].route)} #${reloadFresh[0].cacheId}(문서 ${reloadFresh[0].pageLoadId}) → #${reloadFresh[1].cacheId}(문서 ${reloadFresh[1].pageLoadId})\n`
          : '• 새로고침: 아직 같은 사용자로 새로고침 전후를 비교하지 않았습니다\n'}
      {crossShared
        ? `• 불일치: ${viewerName(crossShared[0].viewer)}·${viewerName(crossShared[1].viewer)}가 같은 cacheId #${crossShared[0].cacheId}\n`
        : isolated
          ? `• 사용자 격리 확인: ${viewers.map(viewerName).join('·')} 기록 ${visits.length}건 중 사용자 간 공유된 cacheId 0건\n`
          : '• 사용자 격리: 두 사용자로 모두 조회하면 확인합니다\n'}
      {probe === null
        ? '• 대조군: 아직 실행하지 않았습니다'
        : probeRejected
          ? `• 대조군 오류 확인: ${probe.ok ? '' : `${probe.name}${probe.digest ? ` (digest ${probe.digest})` : ''}`}`
          : '• 불일치: 일반 use cache에서 cookies()가 값을 반환했습니다'}
    </span>
  )

  return (
    <div className="space-y-3">
      <ExpectedActualPanel
        title="'use cache: private' 저장 위치와 사용자 격리 검증"
        description="탭이 화면에 나타날 때 서버가 보낸 cacheId·본문 실행 시각을 기록해 문서 로드 ID·사용자·탭 기준으로 비교합니다."
        expected={expected}
        actual={actual}
        isMatched={isMatched}
      />
      {process.env.NODE_ENV === 'development' && (
        <p className="rounded-md border border-amber-300 bg-amber-50 p-2.5 text-[11px] leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          dev 서버(next dev)에서는 저장 위치를 판정할 수 없습니다. 링크 프리페치가 동작하지 않아 탭 이동마다 서버 요청이 가고, 서버는
          본문을 실행하면서도 같은 쿠키로 들어온 직전 요청의 결과를 돌려주는 dev 전용 동작이 관측됩니다(다른 브라우저라도 쿠키가 같으면 같은
          cacheId). [서버 실행 횟수 조회]가 탭 이동 뒤에도 늘어나는 것으로 구분할 수 있습니다. 프로덕션 빌드(next build → next start)에서
          확인하세요.
        </p>
      )}
      {visits.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
          <table data-testid="observation-log" className="w-full text-left font-mono text-[11px]">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-2 py-1.5">기록</th>
                <th className="px-2 py-1.5">문서</th>
                <th className="px-2 py-1.5">사용자</th>
                <th className="px-2 py-1.5">탭</th>
                <th className="px-2 py-1.5">cacheId</th>
                <th className="px-2 py-1.5">본문 실행 시각</th>
                <th className="px-2 py-1.5">서버 실행 순번</th>
                <th className="px-2 py-1.5">화면 표시 시각</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v, i) => {
                const reused = visits.slice(0, i).some((p) => p.cacheId === v.cacheId)
                return (
                  <tr key={`${v.pageLoadId}-${v.seq}`} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="px-2 py-1">#{v.seq}</td>
                    <td className="px-2 py-1">{v.pageLoadId}</td>
                    <td className="px-2 py-1">{viewerName(v.viewer)}</td>
                    <td className="px-2 py-1">{routeLabel(v.route)}</td>
                    <td className="px-2 py-1">
                      #{v.cacheId}{' '}
                      <span className={reused ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}>
                        {reused ? '(재사용)' : '(새 실행)'}
                      </span>
                    </td>
                    <td className="px-2 py-1">{v.generatedAt}</td>
                    <td className="px-2 py-1">{v.execNoForViewer}번째</td>
                    <td className="px-2 py-1 text-emerald-700 dark:text-emerald-400">{v.shownAt}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {execChecks.length > 0 && (
        <p data-testid="exec-check-log" className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
          서버 실행 횟수 조회:{' '}
          {execChecks.map((c) => `${viewerName(c.viewer)} ${c.count}회(${c.checkedAt})`).join(' → ')}
        </p>
      )}
    </div>
  )
}
