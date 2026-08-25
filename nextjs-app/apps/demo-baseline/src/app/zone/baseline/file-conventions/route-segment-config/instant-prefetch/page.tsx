import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InstantPrefetchDemo } from './components/InstantPrefetchDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"라우트 세그먼트 프리페칭 및 즉시 렌더링 설정"}
        concept={"라우트 세그먼트의 캐시 및 프리페치 정책을 구성하여 링크 마우스 호버 시점(0ms)에 페이지 청크를 미리 로드하고 즉각적인 네비게이션을 지원합니다."}
        steps={[
        {
        "step": 1,
        "title": "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
        "description": "프리페칭 타깃 상품 링크를 선택합니다.",
        "actionBadge": "링크 선택"
        },
        {
        "step": 2,
        "title": "[+] 수량 조절 후 [동작 실행] 클릭",
        "description": "프리페치 요청을 실행하여 RSC 페이로드를 브라우저 캐시에 사전 적재합니다.",
        "actionBadge": "프리페치 실행"
        },
        {
        "step": 3,
        "title": "0ms 즉시 네비게이션 전환 확인",
        "description": "클릭 즉시 네트워크 대기 시간 없이 사전 로드된 캐시로 화면이 전환되는지 확인합니다.",
        "actionBadge": "0ms 전환",
        "observe": "3단 검증 패널에서 라우트 프리페치 완료 상태와 즉각적인 화면 전환 성능 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"세그먼트 즉시 프리패칭 (instant) 실습"}>
        <InstantPrefetchDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
