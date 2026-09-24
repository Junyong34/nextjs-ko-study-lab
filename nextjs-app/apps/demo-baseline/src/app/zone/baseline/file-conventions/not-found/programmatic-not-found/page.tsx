import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/not-found/programmatic-not-found')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ProgrammaticNotFoundLab } from './components/ProgrammaticNotFoundLab'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="notFound() 프로그래밍 트리거"
        concept="notFound()는 page 본문, generateMetadata, 하위 세그먼트, Server Action 어디서 호출하든 예외를 던져 그 자리에서 실행을 끝내고, 위로 올라가며 처음 만나는 not-found.tsx가 화면을 대신합니다. 다만 호출 위치에 따라 HTTP 상태 코드는 달라질 수 있습니다."
        steps={[
          {
            step: 1,
            title: '[존재하지 않는 id P-999 →] 등 트리거 카드 클릭',
            description: 'Link로 이동해 [id]/not-found.tsx 경계와, 경계 아래 "방금 notFound()를 호출한 지점" 패널을 확인한 뒤 [← 실습으로 돌아가기]로 복귀합니다.',
            actionBadge: 'Link 이동',
            observe: '호출 지점·조건과 "다음 줄 실행 0회"가 서버 카운터에서 읽혀 표시됨',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[공개 상품 P-100 (대조군) →] 이동 후 [R-2 수정 열기] 클릭',
            description: '작성자가 아닌 리뷰 수정 요청을 Server Action이 notFound()로 거절합니다. [R-1 수정 열기]는 정상 반환됩니다.',
            actionBadge: 'Server Action',
            observe: 'URL은 /P-100 그대로인데 화면이 [id]/not-found.tsx로 교체됨',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[전체 트리거 실측 실행] 클릭',
            description: '7개 트리거를 숨은 iframe에서 실제로 요청·클릭하고 상태 코드, 경계 식별자, 카운터 증감을 표에 채웁니다.',
            actionBadge: '실측',
            observe: 'page 계열은 404, generateMetadata는 200(스트리밍), 모든 트리거에서 "다음 줄 +0"',
            observeAt: 'verification',
          },
        ]}
      />
      <ProgrammaticNotFoundLab />
    </DemoContainer>
  )
}
