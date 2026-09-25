import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RouterCacheProvider } from './components/RouterCacheProvider'
import { NavControls } from './components/NavControls'
import { MeasurementBoard } from './components/MeasurementBoard'
import { VerificationFooter } from './components/VerificationFooter'

/**
 * 공유 layout: catalog ↔ product 이동과 뒤로/앞으로, router.refresh() 중에도 리마운트되지 않으므로
 * 측정기(RouterCacheProvider)가 이동 전후를 모두 관찰한다. 측정 대상은 children 슬롯의 동적 page다.
 */
export default function RouterCacheBackLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouterCacheProvider>
      <DemoContainer className="space-y-6">
        <DemoGuideCard
          title="Router Cache: 뒤로 가기 복원 vs 새 진입 vs refresh"
          concept="동적 page는 <Link>로 들어갈 때마다 서버가 다시 렌더하지만, 뒤로/앞으로 가기(popstate)는 브라우저 메모리의 Client Cache에 남은 RSC 페이로드로 서버 요청 없이 복원됩니다. router.refresh()는 그 캐시를 무시하고 서버에 다시 요청합니다."
          steps={[
            {
              step: 1,
              title: '[상품 목록 페이지로 이동 →] 후 [상품 상세 페이지로 이동 →] 클릭',
              description: '<Link> 새 진입마다 렌더 ID가 새로 바뀌고 RSC 요청이 1건 이상 기록되는지 봅니다.',
              actionBadge: '새 진입',
            },
            {
              step: 2,
              title: '[← router.back()] / [router.forward() →] 또는 브라우저 뒤로 버튼',
              description: '이전에 봤던 렌더 ID가 그대로 돌아오고 RSC 요청이 0건인지, 소요 시간이 얼마나 짧은지 봅니다.',
              actionBadge: '복원',
              observe: '측정표의 "서버 재렌더"와 "RSC 요청" 열',
              observeAt: 'playground',
            },
            {
              step: 3,
              title: '[router.refresh()] 클릭 후 다시 뒤로/앞으로',
              description: '같은 경로에서 새 렌더 ID와 RSC 요청이 생기는지, dev와 production에서 값이 어떻게 다른지 확인합니다.',
              actionBadge: '갱신',
              observe: '검증 패널의 판정과 방식별 평균 소요 시간',
              observeAt: 'verification',
            },
          ]}
        />
        <DemoPlaygroundCard title="이동 방식별 서버 재요청 실측" className="min-w-0">
          <div className="space-y-4">
            <NavControls />
            {children}
            <MeasurementBoard />
          </div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </DemoContainer>
    </RouterCacheProvider>
  )
}
