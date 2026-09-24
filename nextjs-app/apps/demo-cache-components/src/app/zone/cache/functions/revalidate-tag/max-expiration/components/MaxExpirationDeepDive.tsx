import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const FLOW = `POST /invalidate (Route Handler)
  bumpSourcePrice()              원본 v1 → v2
  revalidateTag(tag, profile)    태그 기록: stale = 지금, expired = 지금 + profile.expire

GET /probe (1회차)  ─ 무효화 후 경과 시간 < expire ?
  예  → stale 엔트리(v1, 같은 cacheId)를 즉시 반환 + 백그라운드 재계산 시작
  아니오 → 엔트리 폐기 → 본문 재실행을 기다림(600ms) → v2, 새 cacheId

GET /probe (2회차, 1초 뒤)
  → v2 엔트리 (1회차가 SWR이었다면 백그라운드가 만든 것, 블로킹이었다면 1회차가 만든 것)`

const PROFILES_TABLE: [string, string, string][] = [
  ["'max' (권장)", '1년', '거의 항상 SWR — 무효화 후 첫 방문자는 이전 값'],
  ["'hours' 등 다른 프리셋", '1일 (hours)', "expire가 충분히 길면 'max'와 같은 SWR"],
  ['{ expire: 5 }', '5초', '5초 안에 오면 SWR, 5초가 지난 뒤 오면 블로킹 재계산'],
  ['{ expire: 0 }', '0초', '즉시 만료 — 첫 요청부터 재계산을 기다려 새 값'],
]

export function MaxExpirationDeepDive() {
  return (
    <DemoDeepDiveCard title="revalidateTag의 profile 인자와 무효화 후 만료 시간">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 개념</h5>
          <p>
            시그니처는 <code>revalidateTag(tag: string, profile: string | {'{ expire?: number }'})</code>이다. 두 번째 인자로
            넘긴 프리셋 이름이나 객체에서 쓰이는 값은 <code>expire</code>(초)다. 호출 즉시 태그는 stale로 표시되고, 무효화 후{' '}
            <code>expire</code>초가 지나면 만료로 바뀐다. stale 상태에서 들어온 요청은 이전 값을 즉시 받고 재계산은 백그라운드에서
            돈다. 만료된 뒤 들어온 요청은 재계산이 끝날 때까지 기다린다. 두 번째 인자 없는 <code>revalidateTag(tag)</code>는
            deprecated이며, 호출하면 콘솔 경고와 함께 즉시 만료로 동작한다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 데모 흐름</h5>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-2.5 font-mono text-[11px] text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">{FLOW}</pre>
          <p className="mt-1.5">
            원본 조회에 600ms 지연을 넣어, 요청이 재계산을 기다렸는지를 캐시 함수 호출 시간으로 구분한다. 페이지와 probe는{' '}
            <code>connection()</code> 뒤에서 캐시를 읽는다. 그렇지 않으면 <code>next build</code>가 빌드 때 만든 값을 정적 응답으로 굳힌다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. profile별 결과</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="text-zinc-500">
                <tr>
                  <th className="py-1 pr-2">두 번째 인자</th>
                  <th className="py-1 pr-2">expire</th>
                  <th className="py-1">무효화 후 1회차 요청</th>
                </tr>
              </thead>
              <tbody>
                {PROFILES_TABLE.map(([arg, expire, result]) => (
                  <tr key={arg} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className="py-1 pr-2 font-mono">{arg}</td>
                    <td className="py-1 pr-2">{expire}</td>
                    <td className="py-1">{result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 호출 위치와 주의사항</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              <code>revalidateTag</code>는 Server Function과 Route Handler에서 호출할 수 있다. 이 데모는 외부 웹훅 역할의 Route Handler에서
              호출한다. <code>updateTag</code>는 Server Action 전용이다.
            </li>
            <li>
              Server Action에서 호출하면 <code>expire</code>가 0일 때만 액션 응답에 페이지의 새 렌더가 실린다. 16.3.2에서 같은 가격표로
              확인한 결과 <code>&apos;max&apos;</code>·<code>&apos;hours&apos;</code>·<code>{'{ expire: 5 }'}</code>는 새 렌더 없이
              응답했고 <code>{'{ expire: 0 }'}</code>만 새 값을 담아 응답했다.
            </li>
            <li>
              SWR 경로에서 백그라운드로 만든 엔트리도 태그의 만료 시점보다 먼저 만들어졌다면, 그 시점이 지나면 버려진다.{' '}
              <code>{'{ expire: 5 }'}</code>로 대기 0초 측정 후 5초 넘게 지나 다시 요청하면 한 번 더 블로킹 재계산이 일어난다.
            </li>
            <li>
              공식 문서는 웹훅처럼 즉시 만료가 꼭 필요할 때만 <code>{'{ expire: 0 }'}</code>를 쓰고, 사용자가 자기 변경을 바로 봐야 하는
              Server Action에서는 <code>updateTag</code>를 쓰라고 권한다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
