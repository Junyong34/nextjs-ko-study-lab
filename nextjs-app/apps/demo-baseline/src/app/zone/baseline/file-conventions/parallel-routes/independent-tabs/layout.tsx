import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, type DemoStep } from '@study/demo-kit'
import { getDemoMetadata } from '@study/demos'
import { TabsControls } from './components/TabsControls'
import { VerificationFooter } from './components/VerificationFooter'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/parallel-routes/independent-tabs')

const steps: DemoStep[] = [
  { step: 1, title: '두 슬롯에 메모 입력', description: '@dashboard와 @metrics 각각의 메모 칸에 아무 글자나 적습니다. 슬롯 제목 옆 인스턴스 id도 기억해 둡니다.' },
  { step: 2, title: '한쪽 슬롯의 탭만 이동', description: "@dashboard의 '매출 추이'를 누른 뒤 @metrics의 '월간'을 누릅니다. Link 이동이므로 반대쪽 슬롯의 화면·인스턴스 id·메모가 유지되어야 합니다.", observe: '이동하지 않은 슬롯의 상태', observeAt: 'verification' },
  { step: 3, title: '일반 <a>로 같은 이동', description: '비교용 <a> 링크는 전체 문서를 다시 로드합니다. 다른 슬롯이 default.tsx로 바뀌고 메모와 인스턴스 id가 사라져 검증이 실패합니다.', observe: '유지 실패(불일치) 판정', observeAt: 'verification' },
  { step: 4, title: '초기화', description: "'처음 상태로'로 돌아가 반복합니다." },
]

export default function IndependentTabsLayout({ children, dashboard, metrics }: { children: ReactNode; dashboard: ReactNode; metrics: ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard title="병렬 라우트 슬롯의 독립 탭 이동" concept="@dashboard와 @metrics는 같은 URL 아래에서 각자 하위 경로를 가지며, Link로 이동하면 일치하는 슬롯만 바뀌고 다른 슬롯의 화면과 state는 유지됩니다." steps={steps} />
      <DemoPlaygroundCard title="대시보드 · 지표 슬롯">
        <TabsControls />
        <div id="independent-tabs-observation" className="space-y-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{dashboard}{metrics}</div>
          <div>{children}</div>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter rootId="independent-tabs-observation" />
    </DemoContainer>
  )
}
