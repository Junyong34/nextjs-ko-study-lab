import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/trailing-slash/url-normalization')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { TrailingSlashLab } from './components/TrailingSlashLab'
import { TrailingSlashDeepDive } from './components/TrailingSlashDeepDive'

export default function DemoPage() {
  return (
    <DemoContainer className="min-w-0 space-y-4 [&_fieldset]:min-w-0 [&_legend]:max-w-full [&_legend]:break-words">
      <DemoGuideCard
        title="trailingSlash: URL 끝 슬래시 정규화"
        concept="Next.js는 기본적으로 끝 슬래시가 붙은 URL을 슬래시 없는 URL로 308 리다이렉트합니다. trailingSlash: true는 방향을 반대로 바꿉니다. 이 앱은 기본값을 쓰므로 그 동작을 실측하고, true는 예제로 설명합니다."
        className="min-w-0 break-words"
        steps={[
          {
            step: 1,
            title: '경로마다 200/308을 예측하고 [요청] 또는 [전체 요청]',
            description: '서버가 같은 앱에 redirect: manual로 요청해 실제 상태 코드와 Location을 읽습니다.',
            actionBadge: '실측 요청',
            observe: '끝 슬래시 경로의 308과 슬래시를 뗀 Location, 쿼리 보존',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '검증 패널에서 측정·예측 판정 확인',
            description: '6개를 모두 실행하고 측정과 예측이 맞으면 검증 완료입니다. 예측을 일부러 틀리면 불일치가 됩니다.',
            actionBadge: '결과 확인',
            observe: '대기 → 일치 / 불일치, [예제 초기화]로 대기 복귀',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: 'true 예제를 읽고 [개념 확인] 풀기',
            description: '이 앱에는 true를 적용하지 않았습니다. 설정 예제와 별도 앱 확인 절차를 읽고 답을 고릅니다.',
            actionBadge: '개념 확인',
            observe: '문항별 정답/오답과 해설, [답안 초기화]',
            observeAt: 'playground',
          },
        ]}
      />
      <TrailingSlashLab />
      <TrailingSlashDeepDive />
    </DemoContainer>
  )
}
