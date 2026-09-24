import type { Metadata } from 'next'
import React from 'react'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ResponsiveSizesLab } from './components/ResponsiveSizesLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/image/responsive-sizes')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="next/image fill과 sizes — 부모를 채우는 레이아웃과 srcset 후보 선택"
        concept={
          'fill은 부모(position: relative + 크기)를 꽉 채우는 absolute <img>를 만들고, sizes는 브라우저가 srcset 후보 중 무엇을 받을지 정하는 폭 힌트입니다. ' +
          '이 앱은 images.unoptimized: true라 <Image>가 srcset을 만들지 않는다는 사실을 DOM으로 확인하고, sizes에 따른 후보 선택은 문서 기본 폭으로 직접 작성한 네이티브 <img srcSet sizes>로 실측합니다.'
        }
        steps={[
          {
            step: 1,
            title: '[sizes = 그리드 실제 폭] 상태에서 A·B·C 비교',
            description: 'A(next/image)는 srcset이 없고, B·C(네이티브 img)는 w 서술자·1x/2x 서술자로 어떤 후보를 골랐는지 카드 아래 DOM 값으로 확인합니다.',
            actionBadge: 'srcset 모양',
          },
          {
            step: 2,
            title: '[sizes 생략]·[10vw (과소)] 전환',
            description: 'B의 sizes 속성·슬롯 폭·선택된 후보와 파일 폭이 어떻게 달라지는지 봅니다(후보 목록은 고정). A는 sizes를 바꿔도 DOM이 그대로입니다.',
            actionBadge: 'sizes 변경',
          },
          {
            step: 3,
            title: '창 폭을 767px 아래·위로 바꾸고 [캐시 없이 다시 요청]',
            description: '1열↔3열 전환에 따라 sizes 평가값과 currentSrc가 바뀌는지 관찰합니다.',
            actionBadge: '뷰포트 변경',
            observe: '3단 검증 패널에서 세 이미지의 srcset·sizes·선택 후보·파일 폭·렌더 박스가 기대와 일치하는지 대조',
            observeAt: 'verification',
          },
        ]}
      />
      <ResponsiveSizesLab />
    </DemoContainer>
  )
}
