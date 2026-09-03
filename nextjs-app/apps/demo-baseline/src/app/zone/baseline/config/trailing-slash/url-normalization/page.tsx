import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/trailing-slash/url-normalization')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigTrailingSlashDemo } from './components/ConfigTrailingSlashDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="trailingSlash: true URL 끝 슬래시 정규화"
        concept="next.config.ts의 trailingSlash: true 설정을 통해 끝 슬래시가 없는 URL(/shop/items) 접근 시 자동으로 /shop/items/로 308 영구 리다이렉트하여 SEO 중복 URL을 방지합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "슬래시 정규화 대상 상품 경로를 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "trailingSlash 정규화 규칙을 호출하여 URL 끝 슬래시 자동 첨부 동작을 실행합니다.",
            actionBadge: "정규화 실행",
          },
          {
            step: 3,
            title: "끝 슬래시(/) 자동 부착 및 308 리다이렉트 관찰",
            description: "모든 경로가 끝 슬래시가 포함된 정규 URL로 단일화되어 서빙되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "trailingSlash: true 설정에 따라 URL 끝에 슬래시(/)가 자동으로 정규화되어 서빙됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"trailingSlash: true URL 끝 슬래시 정규화 실습"}>
        <ConfigTrailingSlashDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
