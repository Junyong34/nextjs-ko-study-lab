import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProbeProvider } from './components/ProbeContext'
import { RequestLog } from './components/RequestLog'
import { ArrivalTable } from './components/ArrivalTable'
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
        concept="partialPrefetching을 켜지 않아도 도착지 세그먼트에 export const prefetch = 'partial'을 두면 그 라우트로 가는 링크는 URL별 전체 prefetch 대신 라우트당 재사용 가능한 App Shell을 가져옵니다. 클릭한 뒤 어떤 영역이 먼저 보이는지 직접 측정해 보세요."
        steps={[
          {
            step: 1,
            title: '링크가 보이게 두고 prefetch 요청 로그 확인',
            description: '링크 그룹 A·B의 같은 라우트를 가리키는 링크 3개씩이 prefetch 요청을 몇 건 보내는지 기록합니다. production에서만 나갑니다.',
            actionBadge: '관측',
            observe: '요청 로그의 prefetch 건수, 헤더 값과 종류',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '링크 A(partial 기본)와 E(cold)를 클릭하고 [← 목록으로]로 돌아오기',
            description: '클릭한 순간부터 각 영역이 화면에 나타난 시각이 표에 쌓입니다. cold 라우트는 어떤 링크도 prefetch하지 않아 셸을 기다려야 합니다.',
            actionBadge: '클릭 측정',
            observe: 'A·B(고정·캐시)는 prefetch된 라우트에서 먼저, C·D(URL별·실시간)는 늦게 나타남',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[C·D] prefetch 링크와 prefetch={false} 링크도 클릭해 비교',
            description: '상품 5는 prefetch={false}지만 같은 라우트의 다른 링크가 셸을 이미 가져와 즉시 보입니다. 검증 패널에서 기대와 실제를 대조합니다.',
            actionBadge: '검증',
            observe: 'partial 기본 링크와 cold 링크를 모두 클릭하면 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <ProbeProvider>
        <DemoPlaygroundCard title="같은 라우트를 가리키는 여러 <Link> — 실제 RSC 요청">
          <div className="space-y-4">
            {children}
            <ArrivalTable />
            <RequestLog />
          </div>
        </DemoPlaygroundCard>
        <Verification />
        <ConceptCard />
      </ProbeProvider>
    </DemoContainer>
  )
}
