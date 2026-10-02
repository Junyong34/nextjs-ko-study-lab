import React from 'react'
import type { Metadata } from 'next'
import { getImageProps } from 'next/image'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { PRODUCT_SRC } from './lib/constants'
import { ConfigGuide } from './components/ConfigGuide'
import { FormatsLab } from './components/FormatsLab'
import { VerificationFooter } from './components/VerificationFooter'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/images/formats-avif-webp')

export default function DemoPage() {
  // 현재 next.config의 images 설정으로 getImageProps()가 실제로 계산한 <img> 속성
  const { props } = getImageProps({ src: PRODUCT_SRC, alt: '', width: 320, height: 40 })
  const computed = { src: props.src, srcSet: props.srcSet ?? null }

  return (
    <DemoContainer className="min-w-0 space-y-4 [&_fieldset]:min-w-0 [&_legend]:max-w-full [&_legend]:break-words">
      <DemoGuideCard
        title="images.formats: ['image/avif', 'image/webp'] 차세대 포맷"
        concept="formats는 이미지 최적화 API(/_next/image)가 만들 수 있는 출력 포맷 목록이고, 실제 포맷은 요청마다 브라우저의 Accept로 정해집니다. 이 zone은 optimizer가 꺼져 있어, 브라우저가 보내는 Accept와 꺼진 상태의 응답을 재고 변환 결과는 예제와 협상 계산으로 익힙니다."
        className="min-w-0 break-words"
        steps={[
          { step: 1, title: '[브라우저·서버 측정] 누르기', description: '<img>와 fetch()의 Accept, AVIF·WebP 디코드 결과, 같은 Accept로 요청한 /_next/image 응답을 한 번에 잽니다.', observe: 'Accept의 포맷 목록과 실제 디코드 결과의 일치, /_next/image 404', observeAt: 'verification' },
          { step: 2, title: '계산된 응답 포맷과 설정 예제 비교', description: '측정한 Accept로 formats 설정 세 가지의 결과를 계산합니다. 배열 순서를 바꾼 두 설정의 결과를 비교하세요.', observe: '기본값은 WebP. AVIF·WebP를 같은 q로 보내는 브라우저라면 AVIF를 넣었을 때 배열 순서와 관계없이 AVIF', observeAt: 'playground' },
          { step: 3, title: '[개념 확인]에서 응답 포맷을 고르고 [답안 확인]', description: 'Accept의 q값과 formats 조합별로 결과를 고릅니다. [답안 초기화]로 다시 풉니다.', observe: '정답 수와 문항별 계산 결과', observeAt: 'playground' },
        ]}
      />
      <FormatsLab computed={computed} guide={<ConfigGuide />} />
      <VerificationFooter />
    </DemoContainer>
  )
}
