import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-server-inserted-html/head-style')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { UseServerInsertedHtmlDemo } from './components/UseServerInsertedHtmlDemo'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="useServerInsertedHTML 훅을 통한 SSR 인라인 스타일 주입"
        concept="next/navigation의 useServerInsertedHTML() 훅은 CSS-in-JS 레지스트리가 렌더링 중 수집한 스타일 규칙을, 서버가 스트리밍 응답을 플러시할 때마다 그 자리에 그대로 끼워 넣는다. 이 훅이 없으면 스타일은 하이드레이션 이후에야 DOM에 붙어 FOUC가 실제로 발생한다."
        steps={[
          {
            step: 1,
            title: "[with-hook 라우트 새 탭에서 열기] 클릭",
            description: "useServerInsertedHTML을 실제로 호출하는 라우트를 새 탭에서 엽니다.",
            actionBadge: "훅 사용 라우트",
          },
          {
            step: 2,
            title: "[without-hook 라우트 새 탭에서 열기] 클릭",
            description: "동일한 화면이지만 훅을 호출하지 않는 대조군 라우트를 새 탭에서 엽니다.",
            actionBadge: "훅 미사용 라우트",
          },
          {
            step: 3,
            title: "[두 라우트 실제 SSR 응답 비교] 클릭",
            description: "Node http 클라이언트가 두 라우트에 실제 요청을 보내 원본 HTML을 그대로 가져옵니다.",
            actionBadge: "실제 요청 실행",
          },
          {
            step: 4,
            title: "head 삽입 여부 / body 인라인 삽입 여부 관찰",
            description: "with-hook 라우트만 </head> 앞에 <style>이 있고, Suspense로 지연된 두 번째 배지는 body 안에 인라인으로 삽입됩니다.",
            actionBadge: "원본 HTML 대조",
            observe: "with-hook: head 삽입 O, without-hook: head/body 삽입 모두 X",
            observeAt: "verification",
          },
        ]}
      />
      <UseServerInsertedHtmlDemo />
    </DemoContainer>
  )
}
