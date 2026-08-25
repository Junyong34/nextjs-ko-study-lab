import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RouterCacheBackDemo } from './components/RouterCacheBackDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Client-side Router Cache를 통한 0ms 뒤로가기(router.back)"}
        concept={"Next.js 인메모리 Router Cache에 이전 방문한 세그먼트의 RSC 페이로드가 보관되어 있어 router.back() 실행 시 서버 통신 없이 0ms 즉시 화면이 복원됩니다."}
        steps={[
          {
            step: 1,
            title: "상품 목록(/catalog) 및 상세 페이지 이동 이력 확인",
            description: "기존에 탐색한 세그먼트 캐시 타임스탬프와 히스토리 스택을 확인합니다.",
            actionBadge: "히스토리 점검",
          },
          {
            step: 2,
            title: "[← router.back() (0ms 뒤로가기)] 버튼 클릭",
            description: "Router Cache를 활용하여 이전 페이지로 즉각 뒤로가기를 실행합니다.",
            actionBadge: "뒤로가기 실행",
          },
          {
            step: 3,
            title: "[router.forward() →] 앞으로 가기 인터랙션 대조",
            description: "앞으로 가기를 실행하여 캐시된 상세 페이지가 동일하게 0ms로 복원되는지 테스트합니다.",
            actionBadge: "앞으로 가기 실행",
          },
          {
            step: 4,
            title: "0ms 복원 지연 시간 및 스크롤 위치 유지 관찰",
            description: "서버 재요청 없이 인메모리 캐시에서 이전 화면 상태가 온전히 복원되는지 검증합니다.",
            actionBadge: "캐시 복원 검증",
            observe: "router.back() 호출 시 0ms 지연 시간으로 이전 카탈로그 세그먼트가 즉시 복원되는 Router Cache 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Router Cache를 통한 뒤로가기 0ms 즉각 복구 실습"}>
        <RouterCacheBackDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
