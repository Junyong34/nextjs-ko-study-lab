import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/i18n/dictionary-translation')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { I18nDictionaryDemo } from './components/I18nDictionaryDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"서버 컴포넌트 사전(Dictionary) JSON 기반 다국어 번역"}
        concept={"클라이언트 번들에 모든 언어 번역본을 포함하지 않고, 서버 컴포넌트에서 getDictionary(lang)으로 필요한 언어의 JSON 사전만 동적 import하여 0 KB 번들로 번역 텍스트를 주입합니다."}
        steps={[
          {
            step: 1,
            title: "[한국어 사전] 적용 텍스트(환영합니다, 결제하기, 무료 배송) 확인",
            description: "ko.json 사전이 로드된 초기 UI 번역 상태를 확인합니다.",
            actionBadge: "한국어 사전 확인",
          },
          {
            step: 2,
            title: "[English Dict] 버튼 클릭으로 영어 사전 전환",
            description: "en.json 사전을 동적으로 로드하여 다국어 딕셔너리 맵을 교체합니다.",
            actionBadge: "영어 사전 로드",
          },
          {
            step: 3,
            title: "Welcome, Checkout, Free Shipping 번역 즉시 갱신 관찰",
            description: "번역 키(dict.welcome 등)에 매핑된 현지화 문구가 깜빡임 없이 치환되는지 검증합니다.",
            actionBadge: "번역 갱신 검증",
            observe: "사전 전환 시 JSON 딕셔너리 데이터 변경에 따른 다국어 UI 텍스트(환영합니다 -> Welcome) 동기화 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"서버 측 JSON 사전 기반 번역 렌더링 실습"}>
        <I18nDictionaryDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
