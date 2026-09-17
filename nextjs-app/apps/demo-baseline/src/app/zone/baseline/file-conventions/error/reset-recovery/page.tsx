import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/error/reset-recovery')

import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ScenarioLauncher } from './components/ScenarioLauncher'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="error.tsx reset() 컴포넌트 재시도 복구"
        concept="error.tsx는 error·reset·retry 세 값을 받는 에러 바운더리입니다. retry()는 실제로 세그먼트를 재요청·재렌더링하고, reset()은 재요청 없이 에러 상태만 초기화합니다 — 이 데모에서는 실제 서버 카운터로 두 함수의 차이와, 일시적 오류/근본 오류 두 케이스의 재시도 결과 차이를 직접 확인합니다."
        steps={[
          {
            step: 1,
            title: '[일시적 오류 / 근본 오류] 케이스 선택',
            description: '실제 order 라우트 세그먼트로 이동해 서버가 실제로 판정한 실패 상태를 확인합니다.',
            actionBadge: '세그먼트 이동',
          },
          {
            step: 2,
            title: '[에러 상태만 초기화 (reset())] 클릭',
            description: '재요청 없이 에러 상태만 초기화합니다. 서버 attempt 카운터가 그대로인지 확인합니다.',
            actionBadge: 'reset() 호출',
          },
          {
            step: 3,
            title: '[다시 시도 (retry())] 반복 클릭',
            description: '세그먼트를 실제로 재요청합니다. 일시적 오류는 결국 성공하고, 근본 오류는 계속 실패합니다.',
            actionBadge: 'retry() 호출',
            observe: '두 케이스의 attempt 카운터와 성공/실패 전환을 검증 패널에서 대조',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="주문 상태 조회 실습 (order/transient-outage, order/persistent-fault)">
        <ScenarioLauncher />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
