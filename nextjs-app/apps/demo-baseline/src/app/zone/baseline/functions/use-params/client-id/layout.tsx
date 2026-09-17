import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProductLinkNav } from './components/ProductLinkNav'
import { VerificationFooter } from './components/VerificationFooter'

export default function UseParamsClientIdLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="useParams()를 이용한 Client Component 다이나믹 세그먼트 파라미터 추출"
        concept="useParams() (next/navigation)은 Client Component 전용 훅으로, 실제 다이나믹 라우트 세그먼트([category]/[id])가 채워진 현재 URL 값을 객체로 반환합니다. Props로 내려받지 않아도 됩니다."
        steps={[
          {
            step: 1,
            title: '[/electronics/prod-001] 상품 링크 클릭',
            description: '실제 [category]/[id] 서브 라우트로 이동해 useParams()가 category/id를 읽어오는 것을 확인합니다.',
            actionBadge: '실제 이동',
          },
          {
            step: 2,
            title: '[/fashion/prod-004] 등 다른 상품으로 전환',
            description: '서로 다른 category 값을 가진 상품 경로를 오가며 useParams() 반환값이 클릭할 때마다 실시간으로 바뀌는지 관찰합니다.',
            actionBadge: '파라미터 갱신',
            observe: '인스펙터의 useParams() 반환값과 방금 클릭한 링크의 category/id가 정확히 일치',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[/electronics/does-not-exist] 링크로 전환',
            description: '존재하지 않는 id로 이동해 useParams()가 값 검증 없이 URL 세그먼트를 그대로 반환하는지 확인합니다.',
            actionBadge: '미스매치 케이스',
          },
          {
            step: 4,
            title: '하단 검증 패널에서 실제 라우팅 여부 확인',
            description: '직전 파라미터와 현재 파라미터를 비교해 useParams()가 흉내가 아니라 실제 URL 변화에 반응했는지 검증합니다.',
            actionBadge: '검증 완료',
            observe: '상품을 전환할 때마다 전환 감지 횟수가 증가하고, 직전 파라미터와 현재 파라미터가 서로 달라짐',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="useParams() 대상 컴포넌트 — 실제 서브 라우트(/[category]/[id]) 이동">
        <ProductLinkNav />
        <div className="mt-3">{children}</div>
      </DemoPlaygroundCard>

      <VerificationFooter />
    </DemoContainer>
  )
}
