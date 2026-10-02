import React from 'react'
import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ConfigExpireTimeDemo } from './components/ConfigExpireTimeDemo'
import { VerificationFooter } from './components/VerificationFooter'

export const metadata: Metadata = getDemoMetadata('cache', 'config/expire-time/memory-isr-tuning')

// 페이지 자체는 정적 셸이다. NODE_ENV는 빌드 시 결정되며(dev: development, next build: production),
// 헤더 측정은 브라우저가 targets/ 아래 대상 라우트를 요청해 수행한다.
export default function DemoPage() {
  return (
    <DemoContainer className="min-w-0 space-y-4 [&_fieldset]:min-w-0 [&_legend]:max-w-full [&_legend]:break-words">
      <DemoGuideCard
        title="expireTime: ISR 응답을 오래된 상태로 내보낼 수 있는 상한"
        concept="expireTime은 expire를 정하지 않은 ISR 경로의 expire 기본값입니다. Cache-Control의 stale-while-revalidate가 expire − revalidate로 계산됩니다. 이 앱은 설정하지 않은 기본값(31536000초)을 실측하고, 값을 바꾸는 예제는 설명으로 다룹니다."
        className="min-w-0 break-words"
        steps={[
          {
            step: 1,
            title: '[헤더 측정] 누르기',
            description: '세 대상 라우트(default 프로필, hours 프로필, 동적)의 실제 Cache-Control을 받아 옵니다. dev 서버에서는 판정 불가로 표시됩니다.',
            observe: '대상별 실제 헤더와 production 기대값',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '판정 결과와 이유 확인',
            description: 'default 프로필만 expireTime 기본값으로 stale-while-revalidate가 계산되는지 비교합니다. [측정 초기화]로 대기 상태로 돌아갑니다.',
            observe: 'Cache-Control 실측 패널의 일치/불일치/판정 불가',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '설정 예제를 읽고 [개념 확인]에 답하기',
            description: 'expireTime: 3600을 적용했을 때의 헤더 변화를 예측하고 답을 고릅니다. [답안 초기화]로 다시 풀 수 있습니다.',
            observe: '정답 수와 문항별 해설',
            observeAt: 'verification',
          },
        ]}
      />
      <ConfigExpireTimeDemo nodeEnv={process.env.NODE_ENV} />
      <VerificationFooter />
    </DemoContainer>
  )
}
