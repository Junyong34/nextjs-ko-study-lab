import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { AuthCacheContextDemo } from './components/AuthCacheContextDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"정적 캐시 레이아웃과 클라이언트 세션 컨텍스트 결합"}
        concept={"GNB와 레이아웃은 'use cache'로 100% 정적 캐싱하고, 사용자 인증 상태(로그인 이름/장바구니)는 클라이언트 Context/use()로 주입하여 정적 캐시 효율과 개인화 UI를 동시에 달성합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "정적 캐시된 GNB 헤더 셸 렌더링 확인 및 [로그인 상태 변경] 토글로 클라이언트 세션 주입",
                    "description": "모든 사용자에게 동일하게 0ms로 서빙되는 정적 내비게이션 레이아웃을 확인합니다. 클라이언트 Context를 통해 세션 데이터를 변경하여 정적 레이아웃 내부의 사용자 영역을 동적으로 채웁니다.",
                    "actionBadge": "정적 GNB 확인"
          },
          {
                    "step": 2,
                    "title": "정적 셸 캐시 유지 및 개인화 프로필 슬롯 갱신 관찰",
                    "description": "전체 페이지를 동적 렌더링으로 전환하지 않고도 사용자 프로필만 정확히 치환되는지 검증합니다.",
                    "actionBadge": "하이브리드 검증",
                    "observe": "정적 캐시 레이아웃 유지 상태에서 클라이언트 세션 컨텍스트를 통한 사용자 배지 및 닉네임 동적 렌더링 관찰",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"정적 캐시 상품 레이아웃 + Context use(UserContext) 세션 스트리밍 실습"}>
        <AuthCacheContextDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
