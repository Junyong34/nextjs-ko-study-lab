import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MultiFilterWidgetDemo } from './components/MultiFilterWidgetDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"URL searchParams 기반 다중 필터 위젯 상태 동기화"}
        concept={"useSearchParams와 useRouter를 결합하여 카테고리, 가격대, 정렬 필터 상태를 브라우저 URL 쿼리 스트링(?category=shoes&sort=price_asc)과 실시간 동기화하여 북마크 및 공유를 지원합니다."}
        steps={[
          {
            step: 1,
            title: "다중 필터 위젯(카테고리/가격/정렬) 옵션 확인",
            description: "초기 쿼리 스트링 상태와 필터 선택 체크박스/라디오 버튼을 점검합니다.",
            actionBadge: "필터 옵션 확인",
          },
          {
            step: 2,
            title: "카테고리 및 가격 필터 조합 선택",
            description: "필터 항목을 클릭하여 URLSearchParams 객체를 생성하고 shallow 라우팅을 실행합니다.",
            actionBadge: "필터 선택",
          },
          {
            step: 3,
            title: "브라우저 URL 쿼리 스트링 갱신 및 필터링 결과 관찰",
            description: "URL 주소창에 쿼리 매개변수가 즉시 반영되고 필터 조건에 부합하는 상품만 필터링되는지 검증합니다.",
            actionBadge: "동기화 검증",
            observe: "필터 선택에 따른 URL searchParams 쿼리 스트링 변경 및 일치하는 상품 목록 즉시 렌더링 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"다중 필터/정렬/장바구니 복합 인터랙티브 위젯 실습"}>
        <MultiFilterWidgetDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
