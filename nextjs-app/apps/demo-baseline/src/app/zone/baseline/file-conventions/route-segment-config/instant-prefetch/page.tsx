import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/route-segment-config/instant-prefetch')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { InstantPrefetchPlayground } from './components/InstantPrefetchPlayground'

const DETAIL_HREF =
  '/zone/baseline/file-conventions/route-segment-config/instant-prefetch/detail'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"route segment config 'instant' / 'prefetch'와 실제 프리페치 프로토콜"}
        concept={
          "'instant'는 성능 스위치가 아니라 즉시 UI 기대를 깨는 코드를 개발 오버레이에서 잡아주는 검증 도구이고, 'prefetch'는 실제 전송 정책입니다. 둘 다 cacheComponents가 필요해 이 zone에서는 라이브로 켤 수 없어, 대신 그 아래를 떠받치는 실제 RSC 프리페치 요청 헤더(RSC, Next-Router-Prefetch)가 서버 응답을 어떻게 바꾸는지 직접 요청을 보내 확인합니다."
        }
        steps={[
          {
            step: 1,
            title: '[① 일반 요청 실행] 클릭',
            description: '현재 페이지 URL로 헤더 없는 일반 요청을 보냅니다.',
            actionBadge: '기준값 확보',
          },
          {
            step: 2,
            title: '[② RSC 프리페치 신호 요청 실행] 클릭',
            description:
              'Link가 프리페치할 때 실제로 붙이는 RSC/Next-Router-Prefetch 헤더를 실어 같은 URL에 요청합니다.',
            actionBadge: 'RSC 요청',
          },
          {
            step: 3,
            title: '두 응답의 Content-Type·redirect 차이 확인',
            description:
              '헤더만 다른 두 실제 요청이 text/html vs text/x-component로 갈리는지 검증 패널에서 확인합니다.',
            actionBadge: '실측 비교',
            observe: '3단 검증 패널의 기대 결과 vs 실제 측정값 일치 여부',
            observeAt: 'verification',
          },
        ]}
      />
      <InstantPrefetchPlayground detailHref={DETAIL_HREF} />
    </DemoContainer>
  )
}
