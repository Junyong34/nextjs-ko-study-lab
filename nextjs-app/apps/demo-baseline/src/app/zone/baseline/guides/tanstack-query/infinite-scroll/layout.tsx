import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InfiniteScrollProviders } from './providers'
import { LabNav } from './components/LabNav'
import { VerificationFooter } from './components/VerificationFooter'

// 4단 레이아웃을 layout에 두고 실습 화면 안의 {children}만 라우트(page.tsx ↔ notice/page.tsx)에 따라 바뀐다.
// QueryClientProvider도 여기 있으므로 목록이 언마운트돼도 캐시는 유지된다.
export default function InfiniteScrollLayout({ children }: { children: React.ReactNode }) {
  return (
    <InfiniteScrollProviders>
      <DemoContainer className="space-y-6">
        <DemoGuideCard
          title="useInfiniteQuery 커서 페이지네이션과 무한 스크롤"
          concept="useInfiniteQuery는 페이지 배열 하나를 캐시하고, getNextPageParam이 돌려준 커서로 다음 페이지를 붙인다. 스크롤 영역 바닥의 센티널이 보이면 fetchNextPage()를 부르되, 같은 페이지를 두 번 요청하지 않도록 가드를 둔다. 실제 Route Handler 요청 수와 캐시 재사용을 잰다."
          steps={[
            { step: 1, title: '목록을 끝까지 스크롤', description: '센티널이 보일 때마다 다음 커서로 한 페이지씩 요청합니다. 마지막 페이지에서 hasNextPage가 false가 됩니다.', actionBadge: '무한 스크롤', observe: '페이지당 요청 1회, 서버 수신 1회', observeAt: 'verification' },
            { step: 2, title: '[연속 호출] 두 버튼 비교', description: '초기화 후 fetchNextPage()를 5번 연속 부르는 버튼과 cancelRefetch: false로 부르는 버튼을 눌러 요청 수를 비교합니다.', actionBadge: '중복 요청', observe: '기본값은 취소 4회 후 1회 성공, false는 1회', observeAt: 'verification' },
            { step: 3, title: '[공지사항] 갔다가 [상품 목록]으로 복귀', description: '실제 라우트 이동으로 목록이 언마운트됩니다. 60초 안에 돌아오면 캐시에서 바로 그려지는지 봅니다.', actionBadge: '캐시 재사용', observe: '로딩 화면 없음, 추가 요청 0회', observeAt: 'verification' },
          ]}
        />
        <DemoPlaygroundCard title="useInfiniteQuery 상품 목록 (실제 라우트: page.tsx · notice/page.tsx)">
          <LabNav />
          {children}
        </DemoPlaygroundCard>
        <VerificationFooter />
      </DemoContainer>
    </InfiniteScrollProviders>
  )
}
