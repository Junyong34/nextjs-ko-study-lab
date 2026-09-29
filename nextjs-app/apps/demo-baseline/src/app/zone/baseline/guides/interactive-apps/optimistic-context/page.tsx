import type { Metadata } from 'next'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { getDemoMetadata } from '@study/demos'
import { DeepDive } from './components/DeepDive'
import { EventsHeader } from './components/EventsHeader'
import { SummaryPanel, VerificationPanel, WeekPanel } from './components/Panels'
import { ProviderStatus } from './components/ProviderStatus'
import { EventsProvider } from './providers/EventsProvider'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/interactive-apps/optimistic-context')

// 서버 메모리를 읽으므로 빌드 시점에 굳지 않게 요청마다 렌더한다.
export const dynamic = 'force-dynamic'

export default function OptimisticContextPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="낙관적 변경을 Context로 공유하는 이벤트 보드"
        concept="서버 이벤트는 Server Component가 각 뷰에 내려 주고, 공급자는 변경 목록만 낙관적으로 보유합니다. 각 뷰가 자기 이벤트 위에 변경을 재적용하므로 Server Component를 사이에 둔 트리에서도 같은 결과를 봅니다."
        steps={[
          {
            step: 1,
            title: '[기획 회의]를 [하루 뒤 ▶] 후 곧바로 [+1h]',
            description: '저장(1.2초)이 끝나기 전에 두 번째 변경을 보냅니다. 주간 뷰와 요약 뷰를 함께 봅니다.',
            actionBadge: '연속 변경',
            observe: '두 뷰가 모두 즉시 같은 결과로 바뀌고 [저장 중] 배지가 보이다가, 완료 후 서버 이벤트로 수렴함',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '헤더의 [+ 새 이벤트]와 카드의 [삭제] 사용',
            description: '헤더 버튼과 카드 버튼은 서로 다른 트리 위치에 있지만 같은 공급자로 변경을 보냅니다.',
            actionBadge: 'Context 디스패치',
            observe: '요약 뷰의 요일별 건수가 저장 완료 전에 바뀜',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[데모 이벤트 (읽기 전용)] 변경',
            description: '서버가 변경을 거부하는 이벤트를 옮겨 봅니다.',
            actionBadge: '롤백',
            observe: '잠시 이동했다가 오류 배너와 함께 원래 요일로 돌아감',
            observeAt: 'verification',
          },
          {
            step: 4,
            title: '[mutate 참조 안정화] 체크를 끄고 변경',
            description: '체크를 끈 채 변경을 보내고 프로브의 새 값 횟수를 켠 상태와 비교합니다.',
            actionBadge: '리렌더 관찰',
            observe: '켠 상태에서는 디스패치 소비자의 새 값 횟수가 늘지 않고, 끄면 변경마다 늘어남',
            observeAt: 'playground',
          },
        ]}
      />
      <EventsProvider>
        <DemoPlaygroundCard title="이벤트 보드 (주간 뷰 · 요약 뷰)">
          <div className="space-y-4">
            <EventsHeader />
            <WeekPanel />
            <SummaryPanel />
            <ProviderStatus />
          </div>
        </DemoPlaygroundCard>
        <VerificationPanel />
      </EventsProvider>
      <DeepDive />
    </DemoContainer>
  )
}
