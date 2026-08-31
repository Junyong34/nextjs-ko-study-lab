'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ImageResponsiveDemo } from './components/ImageResponsiveDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop')
  const [loadInfo, setLoadInfo] = useState<{ naturalWidth: number; naturalHeight: number; sizesAttr: string | null } | null>(null)

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"next/image fill 및 sizes 속성 반응형 최적화"}
        concept={"<Image fill sizes=\"(max-width: 768px) 100vw, 50vw\"> 설정으로 뷰포트에 맞는 최적 너비의 이미지를 자동 서빙하여 모바일과 데스크톱의 LCP 성능을 극대화합니다."}
        steps={[
        {
        "step": 1,
        "title": "[[모바일] 모바일 (375px)] 버튼 클릭",
        "description": "모바일 뷰포트 시뮬레이션을 활성화하여 100vw 기준의 최적화 이미지 srcset이 선택되도록 합니다.",
        "actionBadge": "375px 뷰"
        },
        {
        "step": 2,
        "title": "[데스크톱 (1200px)] 버튼 클릭",
        "description": "데스크톱 뷰포트로 전환하여 50vw 기준의 고해상도 이미지가 요청되도록 분기합니다.",
        "actionBadge": "1200px 뷰"
        },
        {
        "step": 3,
        "title": "반응형 sizes 마크업 및 LCP 최적화 관찰",
        "description": "브라우저 화면 너비에 따라 sizes 속성이 브라우저 다운로드 해상도를 제어하는 원리를 확인합니다.",
        "actionBadge": "sizes 검증",
        "observe": "뷰포트 프리셋 전환에 따른 렌더링 컨테이너 너비 변화와 3단 검증 패널의 sizes 속성 일치 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"next/image responsive fill & sizes 속성 반응형 로딩 실습"}>
        <ImageResponsiveDemo device={device} onSetDevice={setDevice} onLoadInfo={setLoadInfo} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={loadInfo ? loadInfo.sizesAttr === (device === 'mobile' ? '100vw' : '50vw') : undefined}
        actual={
          loadInfo
            ? `- 실제 DOM <img sizes="${loadInfo.sizesAttr}">\n- naturalWidth x naturalHeight: ${loadInfo.naturalWidth} x ${loadInfo.naturalHeight}\n- 현재 device: ${device}`
            : undefined
        }
        expected="next/image가 렌더링한 실제 <img> 태그의 sizes 속성이 선택한 device에 맞는 값(모바일 100vw / 데스크톱 50vw)과 일치해야 한다."
      />
    </DemoContainer>
  )
}
