import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const FLOW = `[+] 클릭 → Server Action
  changeQty()                 원본 수량 1 → 2
  updateTag(tag)              태그 엔트리 즉시 만료 + "페이지 다시 그리기" 표시
  ── 같은 액션 응답에 실린 RSC 렌더 ──
  getCachedCartLine()         만료됨 → 본문 재실행(대기) → 2개, 새 cacheId

[+] 클릭 → Server Action
  changeQty()                 원본 수량 1 → 2
  revalidateTag(tag, 'max')   태그 엔트리 stale 표시만 (페이지 다시 그리기 없음)
  ── 액션 응답: 새 렌더 없음, 화면 그대로 ──
  ── 이어진 첫 재요청(router.refresh) ──
  getCachedCartLine()         stale 값 즉시 반환 → 1개, 같은 cacheId
                              (재계산은 백그라운드, 그다음 요청부터 2개)`

export function UpdateTagDeepDive() {
  return (
    <DemoDeepDiveCard title="updateTag의 즉시 만료와 revalidateTag max의 SWR">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 개념</h5>
          <p>
            <code>updateTag(tag)</code>는 태그가 붙은 캐시를 <strong>즉시 만료</strong>시킨다. 그다음 요청은 stale 값을
            받지 않고 새 값이 계산될 때까지 기다린다. 또한 updateTag를 호출한 Server Action은 응답에 페이지의 새 렌더를 함께
            담으므로, 사용자는 클릭 한 번의 응답에서 자신의 변경을 본다(read-your-own-writes).{' '}
            <code>revalidateTag(tag, &apos;max&apos;)</code>는 엔트리를 stale로 표시만 한다. Next.js 16.3 소스
            (<code>revalidate.js</code>)는 이 경우 &quot;server actions don&apos;t pull their own writes&quot;라며 액션 응답에 새
            렌더를 싣지 않고, 이어지는 첫 요청도 stale 값을 즉시 받은 뒤 백그라운드에서 재계산한다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 데모 흐름</h5>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-2.5 font-mono text-[11px] text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">{FLOW}</pre>
          <p className="mt-1.5">
            캐시 값과 원본 값은 <code>connection()</code> 뒤에서 요청 시점에 읽는다. 정적 프리렌더로 두면 빌드 때 만든
            값이 HTML에 굳어 운영 서버의 실제 캐시 상태와 어긋난다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 호출 위치 제약</h5>
          <p>
            <code>updateTag</code>는 Server Action 전용이다. Route Handler에서 호출하면{' '}
            <code>updateTag can only be called from within a Server Action</code> 에러(E872)가 던져진다. 웹훅처럼
            Route Handler에서 무효화해야 한다면 <code>revalidateTag(tag, &apos;max&apos;)</code>를 쓴다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 언제 무엇을 쓰나</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li><strong>updateTag</strong>: 장바구니 수량, 폼 제출, 설정 저장처럼 변경한 본인이 곧바로 결과를 확인해야 할 때</li>
            <li><strong>revalidateTag(tag, &apos;max&apos;)</strong>: CMS 발행 웹훅, 카탈로그 동기화처럼 약간의 지연이 허용되고 응답 속도가 더 중요할 때</li>
          </ul>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">5. 주의사항</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>즉시 만료는 공짜가 아니다. 응답이 재계산을 기다리므로 느린 조회라면 액션 응답도 그만큼 느려진다.</li>
            <li>태그는 앱 전역이다. 이 데모는 <code>functions-update-tag-instant-memory-sync:</code> 접두사로 다른 데모 캐시와 분리한다.</li>
            <li>원본은 서버 프로세스 메모리라 재시작하면 1개로 돌아가고, 여러 인스턴스 사이에서는 공유되지 않는다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
