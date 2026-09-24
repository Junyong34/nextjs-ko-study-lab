'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import type { Observation } from '../types'
import { useObservations } from './ObservationContext'

function evaluate(obs: Observation[]) {
  const pairs = obs.flatMap((a, i) => obs.slice(i + 1).map((b) => [a, b] as const))
  const sameId = (a: Observation, b: Observation) => a.callA.cacheId === b.callA.cacheId
  const hit = pairs.find(([a, b]) => a.argsKey === b.argsKey && sameId(a, b))
  const newEntry = pairs.find(([a, b]) => a.argsKey !== b.argsKey && !sameId(a, b))
  const returned = pairs.find(
    ([a, b]) => a.argsKey === b.argsKey && sameId(a, b) && obs.some((m) => m.seq > a.seq && m.seq < b.seq && m.argsKey !== a.argsKey),
  )
  const keyViolation = pairs.find(([a, b]) => a.argsKey !== b.argsKey && sameId(a, b))
  const notShared = obs.find((o) => o.callA.cacheId !== o.callB.cacheId || o.callA.argsExecNo !== o.callB.argsExecNo)
  const typeFail = obs.find(
    (o) => !o.types.dateIsDate || !o.types.mapIsMap || !o.types.setIsSet || o.types.classInstance.ok,
  )
  const isMatched =
    keyViolation || notShared || typeFail ? false : hit && newEntry && returned ? true : undefined
  return { hit, newEntry, returned, keyViolation, notShared, typeFail, isMatched }
}

export function VerificationFooter() {
  const { observations: obs } = useObservations()
  const { hit, newEntry, returned, keyViolation, notShared, typeFail, isMatched } = evaluate(obs)
  const last = obs.at(-1)

  const expected = (
    <span>
      {'• 같은 인자로 다시 요청: cacheId·본문 실행 시각·실행 횟수가 그대로 (본문 미실행)\n'}
      {'• 다른 인자 조합: 새 캐시 항목 → 새 cacheId, 이 인자 실행 횟수 1회\n'}
      {'• 이전 인자로 복귀: 처음 cacheId가 다시 나타남 (인자별 항목 유지)\n'}
      {'• 같은 요청 안의 호출 A·B: 같은 cacheId (본문은 한 번만 실행)\n'}
      {'• 반환값: Date·Map·Set은 타입 유지, 클래스 인스턴스는 직렬화 오류'}
    </span>
  )

  const actual = (
    <span>
      {obs.length === 0 && '• 관측 대기 중 (페이지 로드 후 첫 요청이 기록됩니다)\n'}
      {hit
        ? `• 캐시 HIT 확인: ${hit[0].argsKey} 요청 #${hit[0].seq}·#${hit[1].seq} 모두 cacheId #${hit[0].callA.cacheId} (${hit[0].callA.generatedAt}), 요청 시각 ${hit[0].requestAt} → ${hit[1].requestAt}\n`
        : '• 캐시 HIT: 아직 같은 인자로 두 번 요청하지 않았습니다\n'}
      {newEntry
        ? `• 인자별 캐시 키 확인: ${newEntry[0].argsKey} #${newEntry[0].callA.cacheId} ≠ ${newEntry[1].argsKey} #${newEntry[1].callA.cacheId}\n`
        : '• 인자별 캐시 키: 아직 다른 인자로 요청하지 않았습니다\n'}
      {returned
        ? `• 이전 인자 복귀 확인: ${returned[0].argsKey}로 돌아오자 cacheId #${returned[1].callA.cacheId}가 다시 나타남 (요청 #${returned[1].seq})\n`
        : '• 이전 인자 복귀: 다른 인자를 거쳐 처음 조합으로 돌아오면 확인합니다\n'}
      {notShared
        ? `• 불일치: 요청 #${notShared.seq}에서 호출 A #${notShared.callA.cacheId} ≠ 호출 B #${notShared.callB.cacheId}\n`
        : obs.length > 0 && `• 요청 내 공유: ${obs.length}번의 요청 모두 호출 A·B가 같은 cacheId\n`}
      {keyViolation && `• 불일치: 서로 다른 인자가 같은 cacheId #${keyViolation[0].callA.cacheId}를 공유\n`}
      {typeFail
        ? `• 불일치: 요청 #${typeFail.seq}의 반환 타입 검사 결과가 문서와 다름`
        : last &&
          `• 반환 타입: Date·Map·Set 유지, 클래스 인스턴스는 ${last.types.classInstance.ok ? '반환됨' : '오류로 거부됨'}`}
    </span>
  )

  return (
    <div className="space-y-3">
      <ExpectedActualPanel
        title="인자 기반 캐시 키와 반환값 직렬화 검증"
        description="서버가 요청마다 보낸 캐시 함수 반환값(cacheId, 실행 횟수, 타입 검사 결과)을 요청 단위로 비교합니다."
        expected={expected}
        actual={actual}
        isMatched={isMatched}
      />
      {obs.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
          <table data-testid="observation-log" className="w-full text-left font-mono text-[11px]">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-2 py-1.5">요청</th>
                <th className="px-2 py-1.5">인자</th>
                <th className="px-2 py-1.5">호출 A / B cacheId</th>
                <th className="px-2 py-1.5">본문 실행 시각</th>
                <th className="px-2 py-1.5">인자 실행 횟수</th>
                <th className="px-2 py-1.5">요청 시각</th>
              </tr>
            </thead>
            <tbody>
              {obs.map((o, i) => {
                const reused = obs.slice(0, i).some((p) => p.callA.cacheId === o.callA.cacheId)
                return (
                  <tr key={o.requestId} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="px-2 py-1">#{o.seq}</td>
                    <td className="px-2 py-1">{o.argsKey}</td>
                    <td className="px-2 py-1">
                      #{o.callA.cacheId} / #{o.callB.cacheId}{' '}
                      <span className={reused ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}>
                        {reused ? '(재사용)' : '(이 화면에서 첫 관측)'}
                      </span>
                    </td>
                    <td className="px-2 py-1">{o.callA.generatedAt}</td>
                    <td className="px-2 py-1">{o.callA.argsExecNo}회</td>
                    <td className="px-2 py-1 text-emerald-700 dark:text-emerald-400">{o.requestAt}</td>
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
