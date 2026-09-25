import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { MaxDurationTimeoutDemo } from './components/MaxDurationTimeoutDemo'
import { VerificationFooter } from './components/VerificationFooter'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/route-segment-config/max-duration-timeout',
)

/**
 * 이 페이지에서 호출하는 모든 Server Action(./actions.ts)의 기본 타임아웃을 결정한다.
 * ./settle-batch/route.ts는 별도로 자신만의 maxDuration(3초)을 선언한다 — 세그먼트마다 독립적이다.
 */
export const maxDuration = 6

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="export const maxDuration — 서버 로직 최대 실행 시간 선언"
        concept="maxDuration은 라우트 세그먼트 서버 로직의 최대 실행 시간(초)을 배포 플랫폼에 전달하는 선언일 뿐이다. 실제 강제 종료는 Vercel 같은 배포 플랫폼이 수행하며, 로컬 next dev/start는 이 값으로 요청을 끊지 않는다 — 이 데모는 그 차이를 실측으로 보여준다."
        steps={[
          {
            step: 1,
            title: '주문 건수를 늘려 [+] 클릭',
            description: '건당 약 0.7초가 실제로 걸리므로, 건수를 늘리면 처리 시간이 실제로 늘어난다.',
            actionBadge: '건수 조절',
          },
          {
            step: 2,
            title: '[Server Action으로 정산 실행] 또는 [Route Handler로 정산 실행] 클릭',
            description: 'actions.ts의 Server Action(페이지 maxDuration=6초) 또는 settle-batch/route.ts(자체 maxDuration=3초)를 실제로 호출한다.',
            actionBadge: 'API 호출',
          },
          {
            step: 3,
            title: '선언값과 실측 처리 시간 비교',
            description: '건수를 충분히 늘려 선언값(6초 또는 3초)을 넘겨도 로컬은 요청을 끝까지 실행해 200으로 응답하는지 확인한다.',
            actionBadge: '실측 대조',
            observe: '응답의 declaredMaxDurationSeconds·elapsedMs·exceededDeclaredLimit 필드가 검증 패널에 그대로 반영되는지',
            observeAt: 'verification',
          },
        ]}
      />
      <MaxDurationTimeoutDemo pageMaxDurationSeconds={maxDuration} />
      <VerificationFooter pageMaxDurationSeconds={maxDuration} />
    </DemoContainer>
  )
}
