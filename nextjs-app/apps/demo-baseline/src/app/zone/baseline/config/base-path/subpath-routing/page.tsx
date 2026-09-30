import React from 'react'
import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ConfigBasePathDemo } from './components/ConfigBasePathDemo'
import { VerificationFooter } from './components/VerificationFooter'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/base-path/subpath-routing')

export default function DemoPage() {
  return (
    <DemoContainer className="min-w-0 space-y-4 [&_fieldset]:min-w-0 [&_legend]:max-w-full [&_legend]:break-words">
      <DemoGuideCard
        title="basePath의 서브패스와 링크·이미지 경로"
        concept="쇼핑몰을 /shop 아래에 배포할 때 next.config.ts의 basePath를 빌드에 반영합니다. Link의 경로와 이미지 src의 처리 방식은 다릅니다."
        className="min-w-0 break-words"
        steps={[
          { step: 1, title: "basePath로 바뀌는 [설정 예제]의 경로 비교", description: "Link의 /shop/products와 Image의 /shop/shoes.webp를 구분합니다.", observe: '설정의 적용 대상과 별도 앱에서 실행할 절차', observeAt: 'playground' },
          { step: 2, title: '[개념 확인]에서 답을 고르고 [답안 확인] 누르기', description: '두 문항을 모두 고르면 답안을 확인할 수 있습니다. 오답도 선택해 차이를 비교하세요.', observe: '선택한 답과 정답 수, 각 문항의 해설', observeAt: 'verification' },
          { step: 3, title: '[답안 초기화] 후 다시 풀기', description: '선택과 판정이 대기 상태로 돌아옵니다. 개념 정리에서 설정의 제한을 확인한 뒤 다시 답하세요.', observe: '선택 해제와 검증 패널의 대기 상태', observeAt: 'verification' },
        ]}
      />
      <ConfigBasePathDemo />
      <VerificationFooter />
    </DemoContainer>
  )
}
