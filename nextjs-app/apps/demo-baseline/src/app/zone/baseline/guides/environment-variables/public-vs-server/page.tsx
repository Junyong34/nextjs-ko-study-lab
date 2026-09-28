import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/environment-variables/public-vs-server')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { EnvPlayground } from './components/EnvPlayground'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="NEXT_PUBLIC_ 환경변수 vs 서버 전용 시크릿 분리"
        concept="NEXT_PUBLIC_ 접두사가 붙은 환경변수(NEXT_PUBLIC_STORE_NAME)만 빌드 시 클라이언트 번들에 인라인되고, 접두사 없는 값(INTERNAL_ADMIN_EMAIL)은 서버에서만 접근됩니다. 이 앱의 실제 .env에 두 값이 정의되어 있습니다."
        steps={[
          {
            step: 1,
            title: "브라우저 쪽 값과 서버 쪽 값을 나란히 비교",
            description: "왼쪽 카드는 클라이언트 코드가 직접 process.env를 참조한 결과입니다. NEXT_PUBLIC_STORE_NAME은 보이고 INTERNAL_ADMIN_EMAIL은 undefined인지 확인합니다.",
            actionBadge: "클라이언트 값 확인",
          },
          {
            step: 2,
            title: "[Server Action으로 서버에서 다시 읽기] 클릭",
            description: "서버에서 실제로 process.env를 읽어 반환합니다. 서버는 INTERNAL_ADMIN_EMAIL도 정상적으로 읽을 수 있어야 합니다.",
            actionBadge: "서버 값 확인",
            observe: "클라이언트는 INTERNAL_ADMIN_EMAIL이 undefined, 서버는 실제 값을 반환함",
            observeAt: "playground",
          },
        ]}
      />
      <EnvPlayground />
    </DemoContainer>
  )
}
