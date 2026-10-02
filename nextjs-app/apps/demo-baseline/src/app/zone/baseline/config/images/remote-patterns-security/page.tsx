import React from 'react'
import type { Metadata } from 'next'
import { getImageProps } from 'next/image'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { REMOTE_SAMPLE_URL, SAMPLE_PATH } from './lib/constants'
import type { ComputedImgProps } from './types'
import { ConfigGuide } from './components/ConfigGuide'
import { RemotePatternsLab } from './components/RemotePatternsLab'
import { VerificationFooter } from './components/VerificationFooter'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/images/remote-patterns-security')

/** 현재 next.config의 images 설정으로 getImageProps()가 실제로 계산한 <img> 속성 */
function computeImgProps(label: string, input: string): ComputedImgProps {
  const { props } = getImageProps({ src: input, alt: '', width: 640, height: 320 })
  return { label, input, src: props.src, srcSet: props.srcSet ?? null }
}

export default function DemoPage() {
  const computed = [computeImgProps('로컬', SAMPLE_PATH), computeImgProps('원격', REMOTE_SAMPLE_URL)]

  return (
    <DemoContainer className="min-w-0 space-y-4 [&_fieldset]:min-w-0 [&_legend]:max-w-full [&_legend]:break-words">
      <DemoGuideCard
        title="images.remotePatterns 외부 이미지 도메인 허용 및 보안"
        concept="remotePatterns는 이미지 최적화 API(/_next/image)가 대신 내려받아도 되는 원격 URL의 허용 목록입니다. 목록 밖 URL은 원본 서버에 연결하기 전에 400으로 거절합니다. 이 zone은 optimizer가 꺼져 있어, 꺼진 상태의 실제 모습을 재고 적용 후 동작은 예제와 문서 규칙 계산으로 익힙니다."
        className="min-w-0 break-words"
        steps={[
          { step: 1, title: '[현재 설정 측정] 누르기', description: 'Server Action이 이 zone의 /_next/image에 로컬·원격 URL을 요청하고, 렌더된 <img>의 src·srcset을 읽습니다.', observe: '/_next/image 상태 코드와 <img src>가 원본 경로인지', observeAt: 'verification' },
          { step: 2, title: '설정 예제와 확인 절차 읽기', description: '별도 앱에서 remotePatterns를 넣고 허용·거절 요청을 비교하는 방법을 확인합니다.', observe: '400 "url" parameter is not allowed가 나오는 조건', observeAt: 'playground' },
          { step: 3, title: '[개념 확인]에서 패턴별로 허용·거절을 고르고 [답안 확인]', description: '좁은 패턴과 넓은 패턴을 바꿔 가며 같은 URL의 결과를 비교합니다. [답안 초기화]로 다시 풉니다.', observe: '정답 수와 URL별로 어긋난 필드', observeAt: 'playground' },
        ]}
      />
      <RemotePatternsLab computed={computed} guide={<ConfigGuide />} />
      <VerificationFooter />
    </DemoContainer>
  )
}
