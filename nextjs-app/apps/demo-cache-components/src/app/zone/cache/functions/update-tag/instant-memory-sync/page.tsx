import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UpdateTagInstantDemo } from './components/UpdateTagInstantDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="updateTag() 즉시 캐시 메모리 패치"
        concept="Next.js 16 updateTag()를 활용하여 네트워크 재요청 지연(0ms) 없이 Data Cache 메모리에 특정 태그의 새 값을 즉시 인라인 패치(Patch)합니다."
        steps={[
          {
            step: 1,
            title: "[updateTag('cart', { count: '}) 즉시 패치] 클릭",
            description: "장바구니 캐시 태그('cart')에 새로운 수량 데이터를 즉시 메모리 패치합니다.",
            actionBadge: "즉시 패치",
          },
          {
            step: 2,
            title: "0ms 네트워크 지연 없는 인메모리 갱신 확인",
            description: "별도 DB 재조회 없이 Data Cache의 엔트리 값이 즉시 새 객체로 치환되는지 확인합니다.",
            actionBadge: "메모리 동기화",
          },
          {
            step: 3,
            title: "장바구니 수량 실시간 갱신 상태 관찰",
            description: "화면 상단의 장바구니 뱃지와 수량 카운트가 즉각적으로 동기화되는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "updateTag 호출로 재요청 없이 인메모리 캐시가 즉각 패치되어 수량이 갱신됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"updateTag() 즉시 캐시 메모리 패치 실습"}>
        <UpdateTagInstantDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
