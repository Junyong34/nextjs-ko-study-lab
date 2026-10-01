'use client'

import type { ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { BASE } from '../data'
import { usePrefetchProbe } from '../hooks/usePrefetchProbe'
import { ProbeContext } from './ProbeContext'
import { RequestLog } from './RequestLog'
import { Verification } from './Verification'

export function PrefetchLab({ children }: { children: ReactNode }) {
  const probe = usePrefetchProbe()
  const router = useRouter()
  const pathname = usePathname()

  const reset = () => {
    probe.reset()
    router.push(BASE)
  }

  return (
    <ProbeContext.Provider value={{ recordHover: probe.recordHover }}>
      <DemoContainer className="space-y-6">
        <DemoGuideCard
          title="링크 호버·이동 시 네트워크 요청 관찰"
          concept="목록의 실제 <Link>가 어떤 RSC 요청을 보내는지 fetch 헤더로 직접 측정한다. 상세 라우트는 정적 정보를 먼저 보여 주고 동적 재고를 Suspense 경계 뒤에서 스트리밍한다."
          steps={[
            { step: 1, title: '목록 표시 후 prefetch 요청 확인', description: '세 카드는 prefetch 기본값 / true / false 링크입니다. 뷰포트에 들어온 링크의 prefetch 요청은 production에서만 발생합니다.', actionBadge: '관측', observe: '관측 로그의 prefetch 요청 수', observeAt: 'playground' },
            { step: 2, title: '[카드]에 마우스 올리기', description: 'hover 이벤트를 기록하고, 그 직후 새 요청이 생기는지 봅니다. 개발 모드에서는 생기지 않습니다.', actionBadge: 'hover' },
            { step: 3, title: '[카드] 클릭', description: '상세 라우트로 이동하며 RSC 요청이 발생합니다. 상품 정보가 먼저 보이고 재고가 약 1.5초 뒤에 도착합니다.', actionBadge: '이동', observe: '헤더 도착 ms와 body 완료 ms의 간격', observeAt: 'playground' },
            { step: 4, title: '검증 패널 확인', description: '실측한 요청 수·헤더·타이밍으로 판정합니다. [예제 초기화]로 로그를 비우고 목록으로 돌아갑니다.', actionBadge: '판정', observeAt: 'verification' },
          ]}
        />
        <DemoPlaygroundCard title="상품 목록 → 상세 라우트 (실제 <Link> 이동)">
          <div className="mb-3 flex items-center justify-between gap-2 text-xs">
            <code className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">{pathname.replace(/^.*\/hover-shell/, '…/hover-shell') || '/'}</code>
            <DemoResetButton onReset={reset} />
          </div>
          {children}
          <RequestLog probe={probe} />
        </DemoPlaygroundCard>
        <Verification probe={probe} />
      </DemoContainer>
    </ProbeContext.Provider>
  )
}
