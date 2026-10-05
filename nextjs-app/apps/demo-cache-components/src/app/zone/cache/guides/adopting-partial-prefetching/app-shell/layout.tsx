import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProbeProvider } from './components/ProbeContext'
import { RequestLog } from './components/RequestLog'
import { Verification } from './components/Verification'
import { ConceptCard } from './components/ConceptCard'

/**
 * 가이드·실습·로그를 layout에 두어 목록과 상세 사이를 이동해도 요청 로그가 유지되게 한다.
 * 이 layout은 런타임 API를 호출하지 않는다.
 */
export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="prefetch = 'partial' 세그먼트의 App Shell 공유 prefetch"
        concept="partialPrefetching을 켜지 않아도 도착지 세그먼트에 export const prefetch = 'partial'을 두면 그 라우트로 가는 링크는 URL별 전체 prefetch 대신 라우트당 재사용 가능한 App Shell을 가져옵니다."
        steps={[
          {
            step: 1,
            title: '링크 그룹 A·B를 뷰포트에 두고 요청 로그 확인',
            description: '같은 라우트를 가리키는 링크 3개씩이 실제 RSC prefetch 요청을 몇 건 보내는지 기록합니다.',
            actionBadge: '관측',
            observe: '요청 로그의 prefetch 건수와 path',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[C·D] 링크 두 개의 요청과 검증 패널 확인',
            description: '<Link prefetch>는 요청이 나가고 prefetch={false}는 나가지 않는지, 기본 링크 3개가 런타임 셸을 공유하는지 대조합니다.',
            actionBadge: '검증',
            observe: 'partial 런타임 셸 1건, prefetch 링크 1건 이상, prefetch={false} 0건이면 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <ProbeProvider>
        <DemoPlaygroundCard title="같은 라우트를 가리키는 여러 <Link> — 실제 RSC 요청">
          <div className="space-y-4">
            {children}
            <RequestLog />
          </div>
        </DemoPlaygroundCard>
        <Verification />
        <ConceptCard />
      </ProbeProvider>
    </DemoContainer>
  )
}
