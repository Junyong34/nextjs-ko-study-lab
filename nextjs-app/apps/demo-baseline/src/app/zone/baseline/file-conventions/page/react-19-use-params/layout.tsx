import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProbeProvider } from './components/ProbeContext'
import { RouteNav } from './components/RouteNav'
import { VerificationFooter } from './components/VerificationFooter'

/**
 * 4단 레이아웃을 layout에 두어 server/[sku], client/[sku] 사이를 실제로 이동해도
 * 가이드·검증 패널(과 관측 기록)이 유지되게 한다. 실습 영역의 {children}만 페이지별로 바뀐다.
 */
export default function React19UseParamsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="page props의 params/searchParams Promise — await vs use() 언래핑"
        concept="page가 받는 params와 searchParams는 값이 아니라 Promise입니다. Server Component page는 await로, 'use client' page는 React 19 use()로 풀며, 서버 page가 Promise를 그대로 Client Component에 넘겨 use()로 풀 수도 있습니다."
        steps={[
          {
            step: 1,
            title: '[server/prod-001?color=black] 링크 클릭',
            description: 'Server Component page가 await 전에 검사한 params/searchParams의 실제 타입과 await 결과를 확인합니다. 아래 카드는 같은 Promise를 넘겨받은 Client Component의 use() 결과입니다.',
            actionBadge: 'await',
            observe: 'instanceof Promise 열이 true, 검사 실행 환경이 server',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[server/prod-001?color=white] 또는 [쿼리만 변경: qty] 클릭',
            description: '경로는 같고 쿼리만 바뀌어도 서버가 다시 렌더링되어 새로운 searchParams Promise를 받는지 확인합니다.',
            actionBadge: '쿼리 변경',
            observe: 'await(searchParams) 결과와 관측 시각이 바뀜',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: "[client/prod-004?size=M&size=L] 링크 클릭",
            description: "'use client' page가 use()로 푼 결과를 확인합니다. 중복 키 size는 배열로 들어옵니다.",
            actionBadge: 'use()',
          },
          {
            step: 4,
            title: '검증 패널에서 판정 확인',
            description: 'Server page와 Client page 관측이 모두 모이면, 각 언래핑 결과를 관측 시점의 실제 URL과 대조해 판정합니다.',
            actionBadge: '검증',
            observe: '두 방식 모두 Promise였고 언래핑 값이 URL과 일치하면 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <ProbeProvider>
        <DemoPlaygroundCard title="page props Promise 언래핑 — 실제 서브 라우트(server/[sku], client/[sku]) 이동">
          <Suspense fallback={<div className="h-16" />}>
            <RouteNav />
          </Suspense>
          <div className="mt-3">{children}</div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ProbeProvider>
    </DemoContainer>
  )
}
