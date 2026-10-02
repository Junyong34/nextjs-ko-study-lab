import React from 'react'
import { DemoGuideCard } from '@study/demo-kit'

export function Guide() {
  return (
    <DemoGuideCard
      title="output: 'export' 환경의 클라이언트 라우팅"
      concept="Link 이동은 문서 전체가 아니라 다음 화면의 RSC payload만 받아 바뀐 부분을 교체합니다. 서버 모드에서는 _rsc 쿼리와 rsc 헤더로 서버에 요청하고, 정적 export에서는 같은 내용을 미리 만든 .txt 파일로 받습니다. 이 화면은 서버 모드의 요청을 실측하고 export 쪽은 설명합니다."
      className="min-w-0 break-words"
      steps={[
        {
          step: 1,
          title: '[장바구니 담기] 후 상품 링크 클릭',
          description: '실제 products/[id] 라우트로 이동합니다. 라우터가 보낸 요청이 표에 기록됩니다.',
          actionBadge: 'Link 이동',
          observe: '_rsc 쿼리, rsc: 1, text/x-component 응답과 유지되는 장바구니 수',
          observeAt: 'playground',
        },
        {
          step: 2,
          title: '[상세 경로 문서 요청] 클릭',
          description: 'generateStaticParams에 있는 상품과 없는 상품을 문서 요청으로 받아 상태 코드를 비교합니다.',
          actionBadge: '동적 경로',
          observe: '목록 안 200, 목록 밖 404',
          observeAt: 'verification',
        },
        {
          step: 3,
          title: 'export 설명을 읽고 [개념 확인] 풀기',
          description: "이 앱에는 output: 'export'를 적용하지 않았습니다. 예제와 별도 앱 확인 절차를 읽고 답을 고릅니다.",
          actionBadge: '개념 확인',
          observe: '문항별 정답/오답과 해설, [답안 초기화]',
          observeAt: 'playground',
        },
      ]}
    />
  )
}
