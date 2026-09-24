import type { Metadata } from 'next'
import React from 'react'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { BlurPlaceholderLab } from './components/BlurPlaceholderLab'
import { buildManualBlurDataURL } from './lib/scene'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/image/blur-placeholder')

export default function DemoPage() {
  // 원격/동적 이미지는 빌드가 blurDataURL을 만들 수 없으므로, 서버에서 8x4 축소본을 직접 만들어 넘긴다.
  const manualBlurDataURL = buildManualBlurDataURL()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="next/image placeholder='blur' — 로딩 중 블러 미리보기와 blurDataURL 출처"
        concept={
          'placeholder="blur"는 이미지가 도착하기 전까지 <img>의 inline background-image에 blurDataURL을 흐리게 깔아 두고, ' +
          '로드·디코드가 끝나면 그 style을 지웁니다. 정적 import는 빌드가 blurDataURL을 자동으로 만들고, 동적/원격 URL은 직접 넘겨야 합니다.'
        }
        steps={[
          {
            step: 1,
            title: '[3000 ms] 버튼 클릭',
            description: '서버가 실제로 3초 늦게 응답하게 만든 뒤 B(blur)와 C(empty) 카드의 로딩 중 화면 차이를 봅니다.',
            actionBadge: '지연 3000 ms',
          },
          {
            step: 2,
            title: '카드별 background-image 수치 확인',
            description: '마운트 직후 style 길이, 안에 든 blurDataURL의 출처(import 객체 / 직접 넘긴 prop), onLoad까지의 ms를 읽습니다.',
            actionBadge: '실측 확인',
          },
          {
            step: 3,
            title: '로드 후 제거 여부 대조',
            description: '[이미지 다시 요청]으로 재측정하며 로드 후 background-image가 사라지는지 확인합니다.',
            actionBadge: '제거 검증',
            observe: '3단 검증 패널에서 세 카드의 로드 전 background 유무·blurDataURL 출처·로드 후 제거가 기대와 일치하는지 대조',
            observeAt: 'verification',
          },
        ]}
      />
      <BlurPlaceholderLab manualBlurDataURL={manualBlurDataURL} />
    </DemoContainer>
  )
}
