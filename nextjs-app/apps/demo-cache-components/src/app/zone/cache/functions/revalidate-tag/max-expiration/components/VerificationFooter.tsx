import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  promoConvergedAt: number | null
  recallConvergedAt: number | null
  promoTriggered: boolean
  recallTriggered: boolean
}

export function VerificationFooter({
  promoConvergedAt,
  recallConvergedAt,
  promoTriggered,
  recallTriggered,
}: VerificationFooterProps) {
  const bothConverged = promoConvergedAt !== null && recallConvergedAt !== null
  const isMatched = bothConverged ? promoConvergedAt! >= 1 && recallConvergedAt === 0 : undefined

  const actual = !promoTriggered && !recallTriggered
    ? '아직 [수정 실행]을 누르지 않았습니다. 두 카드에서 각각 실행한 뒤 [새로고침]을 반복해 반영 시점을 비교하세요.'
    : !bothConverged
      ? `측정 중 — 정책 A(promo) 반영: ${promoConvergedAt === null ? '대기 중' : `새로고침 ${promoConvergedAt}회 만에 반영`} · 정책 B(recall) 반영: ${recallConvergedAt === null ? '대기 중' : `새로고침 ${recallConvergedAt}회 만에 반영`}`
      : `정책 A(revalidateTag(tag,'max')): 새로고침 ${promoConvergedAt}회 만에 반영 · 정책 B(revalidateTag(tag,{ expire: 0 })): 새로고침 ${recallConvergedAt}회 만에 반영`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="revalidateTag() profile 인자에 따른 반영 시점 차이 검증"
        expected={"정책 B({ expire: 0 })는 [수정 실행] 직후 곧바로 반영되어 추가 새로고침이 필요 없다(0회). 정책 A('max')는 실행 직후에도 이전 값이 남아 있고, [새로고침]을 1회 더 눌러야 반영된다(1회)."}
        actual={actual}
        isMatched={isMatched}
        description="같은 cacheLife('max') 캐시 항목이라도, revalidateTag()의 두 번째 인자만 바꾸면 무효화 이후 새 값이 보이기까지 걸리는 새로고침 횟수가 달라진다."
      />

      <DemoDeepDiveCard title="revalidateTag(tag, profile) — 두 번째 인자가 결정하는 무효화 방식">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 시그니처와 세 가지 경로</h5>
            <p>
              <code>revalidateTag(tag: string, profile: string | {'{ expire?: number }'}): void</code>. 두 번째 인자가
              무엇이냐에 따라 무효화 방식이 갈린다 — <code>&apos;max&apos;</code>(또는 다른 cacheLife 프로필 이름)를 주면
              stale-while-revalidate로 동작하고, <code>{'{ expire: 0 }'}</code>처럼 객체를 주면 즉시 만료된다. 인자를
              생략하는 한 자리 형태는 deprecated이며 즉시 만료 + 블로킹 재검증으로 동작한다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 대조 설계</h5>
            <p>
              [프로모션 배너]와 [긴급 리콜 공지] 두 캐시 항목은 <code>cacheLife(&apos;max&apos;)</code>로 동일하게
              장기 보존 설정되어 있다. 차이는 수정 시 호출하는 <code>revalidateTag()</code>의 두 번째 인자뿐이다 —
              배너는 <code>revalidateTag(tag, &apos;max&apos;)</code>, 리콜 공지는{' '}
              <code>revalidateTag(tag, {'{ expire: 0 }'})</code>를 호출한다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 왜 이렇게 갈리는가</h5>
            <p>
              <code>profile=&apos;max&apos;</code>는 태그를 stale로만 표시한다. Server Action이 끝나며 발생하는 첫
              재방문은 여전히 예전 값을 서빙하며 백그라운드에서 새 값을 준비하므로, 사용자는 새로고침을 한 번 더 거쳐야
              새 값을 본다. 반면 <code>{'{ expire: 0 }'}</code>는 태그를 즉시 만료시켜 다음 요청을 캐시 미스로 만들고,
              그 요청 자체가 새 값이 준비될 때까지 블로킹된 뒤 응답한다 — Server Action이 끝나는 시점의 재방문 자체가
              바로 그 요청이라, 별도 새로고침 없이도 이미 반영돼 있다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 활용 기준</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대부분의 콘텐츠(상품 카탈로그, 블로그, 배너)는 약간의 지연이 허용되므로 <code>&apos;max&apos;</code>를 권장한다.</li>
              <li>
                외부 웹훅·CMS 콜백처럼 즉시 반영이 요구되는 경우에만 <code>{'{ expire: 0 }'}</code>를 쓴다 — 매 요청을
                블로킹 재검증으로 만들기 때문에 트래픽이 많은 태그에는 남용하지 않는다.
              </li>
              <li>인자를 생략한 한 자리 형태(<code>revalidateTag(tag)</code>)는 더 이상 권장되지 않는다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
