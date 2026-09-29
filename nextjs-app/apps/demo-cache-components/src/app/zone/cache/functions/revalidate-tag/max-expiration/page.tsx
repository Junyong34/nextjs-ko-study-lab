import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/revalidate-tag/max-expiration')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { RevalidateTagMaxDemo } from './components/RevalidateTagMaxDemo'
import { getPromoNoticeCache, getRecallNoticeCache } from './cachedData'

export default async function DemoPage() {
  const [promo, recall] = await Promise.all([getPromoNoticeCache(), getRecallNoticeCache()])

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="revalidateTag() 만료 인자(profile)가 만드는 반영 시점 차이"
        concept="revalidateTag(tag, { expire: 0 })는 다음 요청을 블로킹 재검증해 Server Action 실행만으로 이미 새 값이 반영됩니다. revalidateTag(tag, 'max')는 stale-while-revalidate라 실행 직후에는 아직 이전 값이 보이고, [새로고침]을 한 번 더 눌러야 반영됩니다. 같은 cacheLife('max') 캐시 항목이라도 무효화 시점의 두 번째 인자만 다르면 반영 시점이 달라집니다."
        steps={[
          {
            step: 1,
            title: "[프로모션 배너]와 [긴급 리콜 공지] 두 카드의 초기 문구·revision 확인",
            description: "두 캐시 항목 모두 cacheLife('max')로 장기 보존 설정되어 있습니다.",
            actionBadge: "초기 상태 확인",
          },
          {
            step: 2,
            title: "[프로모션 배너 수정 실행]과 [긴급 리콜 공지 수정 실행]을 각각 클릭",
            description: "Server Action이 실제 데이터를 바꾸고, 서로 다른 profile 인자로 revalidateTag를 호출합니다 — 배너는 'max', 리콜 공지는 { expire: 0 }.",
            actionBadge: "무효화 실행",
          },
          {
            step: 3,
            title: "[새로고침 (router.refresh())]을 눌러 정책 A가 반영되는지 관찰",
            description: "리콜 공지(정책 B)는 [수정 실행] 직후 이미 반영되어 있습니다. 배너(정책 A)는 아직 이전 문구이며, [새로고침]을 한 번 더 눌러야 반영됩니다.",
            actionBadge: "반영 시점 비교",
            observe: "정책 B는 [수정 실행] 직후 곧바로 '반영 완료'(0회), 정책 A는 [새로고침] 1회 후에 '반영 완료'로 바뀜",
            observeAt: "verification",
          },
        ]}
      />
      <RevalidateTagMaxDemo promo={promo} recall={recall} />
    </DemoContainer>
  )
}
