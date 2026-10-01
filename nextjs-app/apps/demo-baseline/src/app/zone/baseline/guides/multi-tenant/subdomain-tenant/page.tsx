import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { HostPanel } from './components/HostPanel'
import { SubdomainLab } from './components/SubdomainLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/multi-tenant/subdomain-tenant')

export default async function DemoPage() {
  // headers() 는 요청 시점 API다. 이 페이지가 받은 Host 를 그대로 보여 주기 위해 읽는다.
  const h = await headers()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Host 헤더의 첫 라벨로 테넌트 판별"
        concept="서브도메인 멀티 테넌시는 요청의 Host 헤더에서 첫 라벨(acme.example.com 의 acme)을 테넌트로 해석합니다. 브라우저는 Host 를 바꿀 수 없으므로, 서버가 같은 앱의 Route Handler 를 원하는 Host 로 직접 호출해 판별 로직을 실측합니다."
        steps={[
          {
            step: 1,
            title: '이 페이지가 받은 Host 확인',
            description: '노란 상자에 이 페이지 요청의 Host 와 첫 라벨 해석이 표시됩니다. 셸을 거치면 서브도메인이 아닌 셸 호스트가 보입니다.',
            actionBadge: '한계 확인',
            observe: 'Host 가 셸/zone 호스트이고 테넌트는 없음',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[전체 실행] 클릭',
            description: 'Server Action 이 acme·globex·미등록·루트 도메인을 Host 로 지정해 Route Handler 를 실제로 호출하고, fetch 로 Host 를 지정하는 경우와 x-forwarded-host 를 쓰는 경우도 비교합니다.',
            actionBadge: '서버 측 실측',
            observe: '시나리오별 서버가 받은 Host 와 판별된 테넌트',
            observeAt: 'network',
          },
          {
            step: 3,
            title: '검증 패널 확인',
            description: '모든 시나리오가 [O] 이면 검증 완료입니다. fetch 의 Host 가 무시되는 것도 정상 기대값으로 판정합니다.',
            actionBadge: '결과 확인',
            observe: '모든 항목 [O] → 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <SubdomainLab hostPanel={<HostPanel host={h.get('host')} forwardedHost={h.get('x-forwarded-host')} />} />
    </DemoContainer>
  )
}
