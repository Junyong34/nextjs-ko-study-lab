import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'config/expire-time/memory-isr-tuning')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigExpireTimeDemo } from './components/ConfigExpireTimeDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="expireTime 메모리 ISR 캐시 보존 기간 튜닝"
        concept="next.config.ts의 expireTime 설정을 튜닝하여 서버 메모리에 유지되는 ISR 및 Data Cache의 최대 보존 시간(초)을 제어하고 OOM을 방지합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "메모리 캐시 보존 정책을 확인할 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "expireTime 메모리 한도가 적용된 데이터 캐시 쿼리를 실행합니다.",
            actionBadge: "쿼리 실행",
          },
          {
            step: 3,
            title: "메모리 캐시 보존 기간 및 GC 수명 주기 관찰",
            description: "지정된 expireTime 초과 시 메모리에서 안전하게 정리되는지 실시간 로그에서 확인합니다.",
            actionBadge: "로그 검증",
            observe: "expireTime 설정에 따라 서버 메모리 내 캐시 엔트리 수명이 최적화되어 관리됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"expireTime 메모리 ISR 캐시 보존 기간 튜닝 실습"}>
        <ConfigExpireTimeDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
