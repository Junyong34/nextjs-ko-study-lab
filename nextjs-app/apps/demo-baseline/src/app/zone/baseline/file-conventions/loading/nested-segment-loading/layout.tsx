import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { LoadingObservationProvider } from './components/LoadingObservation'
import { NestedSegmentLoadingDemo } from './components/NestedSegmentLoadingDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function NestedSegmentLoadingLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingObservationProvider>
      <DemoContainer className="space-y-6">
        <DemoGuideCard
          title="중첩 라우트 세그먼트 로딩 격리"
          concept="catalog/loading.tsx는 catalog/[run]/layout.tsx와 목록 page.tsx를 함께 감싸는 상위 경계이고, catalog/[run]/[product]/loading.tsx는 상품 상세 page.tsx 하나만 감싸는 하위 경계입니다. 두 경계의 위치가 다르기 때문에, 상품 상세가 로딩되는 동안에도 상위 GNB는 계속 인터랙티브합니다."
          steps={[
            {
              step: 1,
              title: '[새 실행 시작] 클릭',
              description:
                '새로운 내부 catalog/[run] 경로로 이동합니다. 매번 다른 경로가 생성되므로 Router Cache에 걸려 fallback이 생략되지 않습니다.',
              actionBadge: '신규 실행',
            },
            {
              step: 2,
              title: '카탈로그 상위 fallback 관측',
              description:
                '이동 직후 catalog/loading.tsx 스켈레톤이 표시되고, 카탈로그 목록 서버 응답 후 사라지는지 확인합니다.',
              actionBadge: '상위 fallback',
              observe: '관측 콘솔의 ①②가 실제 타임스탬프로 채워지는지 확인',
              observeAt: 'playground',
            },
            {
              step: 3,
              title: '상품 클릭 → 하위 fallback 중 [상위 조작] 클릭',
              description:
                '카탈로그 목록에서 상품을 클릭해 상세로 이동합니다. catalog/[run]/[product]/loading.tsx가 표시되는 동안 GNB의 [상위 조작] 버튼을 눌러 상위 레이아웃이 계속 인터랙티브한지 확인합니다.',
              actionBadge: '하위 fallback 중 조작',
            },
            {
              step: 4,
              title: '검증 패널에서 순서 확인',
              description:
                '다섯 단계가 같은 실행(run) 안에서 순서대로 관측됐는지 확인합니다. 조작 없이 완료하거나 이전 실행 기록을 재사용하면 실패 또는 대기로 표시됩니다.',
              actionBadge: '순서 검증',
              observe: 'isMatched가 true인지, false/대기 사유가 무엇인지 확인',
              observeAt: 'verification',
            },
          ]}
        />
        <DemoPlaygroundCard title="중첩 라우트 세그먼트 로딩 격리 실습" className="min-w-0">
          <NestedSegmentLoadingDemo />
          <div className="mt-4 min-w-0">{children}</div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </DemoContainer>
    </LoadingObservationProvider>
  )
}
