import React from 'react'
import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ConfigCrossOriginDemo } from './components/ConfigCrossOriginDemo'
import { VerificationFooter } from './components/VerificationFooter'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/cross-origin/anonymous-mode')

export default function DemoPage() {
  return (
    <DemoContainer className="min-w-0 space-y-4 [&_fieldset]:min-w-0 [&_legend]:max-w-full [&_legend]:break-words">
      <DemoGuideCard
        title="crossOrigin: 'anonymous' 서드파티 스크립트 속성"
        concept="crossOrigin은 Next가 HTML에 넣는 스크립트·CSS 태그에 crossorigin 속성을 붙이는 전역 설정입니다. 이 앱은 설정을 켜지 않았으므로 현재 상태를 실측하고, 속성의 의미는 <Script crossOrigin>으로 실측합니다."
        className="min-w-0 break-words"
        steps={[
          {
            step: 1,
            title: '[문서 태그 검사] 누르기',
            description: '이 문서의 _next/static 태그를 부트스트랩(defer·link)과 Flight 청크(async)로 나눠 crossorigin 속성을 셉니다.',
            observe: '부트스트랩 태그의 crossorigin 0개, Flight 청크의 값',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[다섯 조합 모두 실행] 또는 조합별 [실행]',
            description: '다른 출처(localhost ↔ 127.0.0.1)의 스크립트를 속성과 서버 헤더를 바꿔 가며 로드합니다. 차단 조합은 콘솔에 CORS 메시지가 찍힙니다.',
            observe: 'onLoad/onError, Sec-Fetch-Mode, 오류 메시지가 가려졌는지',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '설정 예제를 읽고 [답안 확인], [실측 초기화]로 다시 시작',
            description: '설정을 켰을 때의 결과는 별도 앱에서 확인할 절차로 정리했습니다. 초기화하면 모든 판정이 대기 상태로 돌아옵니다.',
            observe: '세 검증 패널의 판정',
            observeAt: 'verification',
          },
        ]}
      />
      <ConfigCrossOriginDemo />
      <VerificationFooter />
    </DemoContainer>
  )
}
