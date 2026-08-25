import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CookiesSessionDemo } from './components/CookiesSessionDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="cookies().get() 읽기 & cookies().set() 세션 쿠키 발급"
        concept="await cookies() 비동기 API를 통해 서버 컴포넌트에서 브라우저 쿠키를 조회(get)하고 Server Action에서 HttpOnly 세션 쿠키를 0ms 지연 없이 안전하게 발급(set)합니다."
        steps={[
          {
            step: 1,
            title: "[홍길동 (CUSTOMER)], [김철수 (VIP)], [이영희 (ADMIN)] 역할 버튼 선택",
            description: "일반 고객(홍길동), VIP(김철수), 관리자(이영희) 프로필 버튼을 클릭하여 세션 변경을 요청합니다.",
            actionBadge: "역할 선택",
          },
          {
            step: 2,
            title: "cookies().set() HttpOnly 세션 쿠키 발급 확인",
            description: "Server Action에서 session-token, user-role 등의 보안 쿠키가 새로 발급되는 과정을 확인합니다.",
            actionBadge: "쿠키 발급",
          },
          {
            step: 3,
            title: "[( ) 등급: | 적립금: P] 서버 Cookies 헤더 갱신 결과 관찰",
            description: "현재 요청의 Server Cookies 헤더 목록에 변경된 토큰과 등급/적립금 데이터가 동기화되는지 확인합니다.",
            actionBadge: "헤더 검증",
            observe: "선택한 사용자 세션에 맞춰 session-token 및 user-role 쿠키 값이 실시간 갱신됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"cookies().get() 읽기 & cookies().set() 세션 쿠키 발급 실습"}>
        <CookiesSessionDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
