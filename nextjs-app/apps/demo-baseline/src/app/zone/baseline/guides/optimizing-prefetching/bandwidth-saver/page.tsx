import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { BandwidthSaverDemo } from './components/BandwidthSaverDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"프리페칭 최적화를 통한 95% 대역폭 절감"}
        concept={"전체 페이지 프리페칭 대신 뷰포트 가시성 필터링과 호버 트리거 조합을 적용하여 기본 120개 요청(1.8 MB)을 6개 요청(92 KB)으로 줄여 95% 대역폭을 절감합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "기본 prefetch 설정 시 트래픽(120개 요청, 1.8 MB) 분석 및 최적화 프리페칭 전략(6개 요청, 92 KB) 대조",
                    "description": "모든 링크를 무조건 프리페치할 때 발생하는 대역폭 낭비 지표를 확인합니다. 화면 중요도에 따른 선별적 프리페치 규칙을 적용한 절감 결과를 점검합니다.",
                    "actionBadge": "기존 트래픽 분석"
          },
          {
                    "step": 2,
                    "title": "95% 네트워크 대역폭 절감 통계 검증",
                    "description": "모바일 데이터 요금 절감 및 브라우저 메모리 부하 감소 효과를 대조 확인합니다.",
                    "actionBadge": "통계 검증",
                    "observe": "최적화 프리페칭 적용 전후 대역폭 절감 수치(1.8 MB -> 92 KB, 95% 절감) 통계 지표 관찰",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"대규모 카탈로그 대역폭 절약 최적화 실습"}>
        <BandwidthSaverDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
