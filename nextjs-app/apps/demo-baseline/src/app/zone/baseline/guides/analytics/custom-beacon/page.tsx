import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { AnalyticsBeaconDemo } from './components/AnalyticsBeaconDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"navigator.sendBeacon을 활용한 비동기 분석 비콘 전송"}
        concept={"사용자가 페이지를 이탈하거나 구매 버튼을 클릭할 때 navigator.sendBeacon()을 사용하여 브라우저 언로드 시에도 요청 취소 없이 204 No Content 비동기 분석 데이터를 안전하게 전송합니다."}
        steps={[
          {
            step: 1,
            title: "초기 비콘 전송 대기 상태 확인",
            description: "분석 이벤트 발생 전 버튼 라벨을 확인합니다.",
            actionBadge: "대기 상태 점검",
          },
          {
            step: 2,
            title: "[[분석] [구매하기 클릭] 커스텀 비콘 이벤트 전송] 버튼 클릭",
            description: "navigator.sendBeacon()을 호출하여 서버로 비차단 백그라운드 분석 페이로드를 전송합니다.",
            actionBadge: "비콘 전송 실행",
          },
          {
            step: 3,
            title: "204 No Content 피드백 및 비콘 전송 완료 관찰",
            description: "화면 전환이나 언로드 중에도 브라우저가 보장하는 비콘 전송 완료 상태([확인] 비콘 전송 완료 (204 No Content))를 검증합니다.",
            actionBadge: "비콘 완료 검증",
            observe: "버튼 클릭 시 navigator.sendBeacon 트리거 및 204 No Content 완료 상태 전환 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"상품 클릭 커스텀 이벤트 비콘 전송 실습"}>
        <AnalyticsBeaconDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
