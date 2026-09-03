import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'directives/use-client/boundary-declaration')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DirectiveUseClientDemo } from './components/DirectiveUseClientDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use client' 클라이언트 컴포넌트 경계 선언"}
        concept={"파일 최상단에 'use client'를 선언하면 해당 모듈과 모든 하위 임포트가 브라우저 번들로 분리되며 React useState, useEffect, 브라우저 이벤트 리스너를 사용할 수 있습니다."}
        steps={[
          {
                    "step": 1,
                    "title": "'use client' 지시어 선언 위치 확인 및 클라이언트 상호작용 훅 사용 점검",
                    "description": "모듈의 맨 첫 줄에 'use client'가 위치하여 서버 컴포넌트와 클라이언트 컴포넌트의 경계를 정의하는지 확인합니다. useState, onClick 핸들러 등 브라우저 런타임 전용 기능이 에러 없이 동작하는지 점검합니다.",
                    "actionBadge": "지시어 위치"
          },
          {
                    "step": 2,
                    "title": "서버/클라이언트 경계 번들 분리 검증",
                    "description": "서버 전용 비밀키나 무거운 백엔드 모듈이 클라이언트 번들로 유출되지 않고 격리되는지 검증합니다.",
                    "actionBadge": "번들 격리",
                    "observe": "3단 검증 패널에서 'use client' 경계 선언에 따른 클라이언트 번들 분리 사양 확인",
                    "observeAt": "verification"
          }
]}
        />
      <DemoPlaygroundCard title={"'use client' 클라이언트 경계 선언 및 이벤트 바인딩 실습"}>
        <DirectiveUseClientDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
