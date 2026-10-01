import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { MANIFEST_URL } from './constants'

// 루트 app/manifest.ts와 달리 중첩 세그먼트에서는 <link rel="manifest">가 자동으로 붙지 않아 직접 연결한다.
export const metadata: Metadata = {
  ...getDemoMetadata('baseline', 'guides/pwas/app-install-prompt'),
  manifest: MANIFEST_URL,
}

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { PwaLab } from './components/PwaLab'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="PWA manifest, 서비스 워커, 홈 화면 설치 프롬프트 직접 확인"
        concept="설치 가능한 PWA는 유효한 manifest와 보안 컨텍스트가 기본 조건이고, 설치 프롬프트(beforeinstallprompt)는 브라우저가 조건을 판단해 보내는 이벤트입니다. 이 화면은 manifest 응답·서비스 워커 scope·이벤트 수신을 모두 브라우저에서 실제로 측정해 보여 줍니다."
        steps={[
          {
            step: 1,
            title: "[② manifest 검사] 결과 읽기",
            description: "페이지 head의 manifest 링크를 따라 fetch로 실제 응답을 읽고 name, start_url, display, 192·512 아이콘(실제 PNG 디코딩)을 검사합니다.",
            actionBadge: "manifest 검증",
            observe: "모든 항목이 ✓이고 [manifest 다시 검사]를 눌러도 같은 결과입니다. Network 탭에서 manifest.webmanifest와 icon/192, icon/512 요청을 볼 수 있습니다.",
            observeAt: "playground",
          },
          {
            step: 2,
            title: "[서비스 워커 등록] 후 [부모 scope로 등록 시도]",
            description: "Route Handler가 서빙하는 sw.js를 허용 scope로 등록하고, 상한을 넘는 부모 경로 등록이 SecurityError로 거부되는지 확인합니다.",
            actionBadge: "scope 제약",
            observe: "활성 상태 activated, controller 있음, 부모 scope 등록은 거부됨으로 바뀌고 검증 패널이 성공으로 판정됩니다. DevTools Application › Service Workers에서도 같은 등록을 볼 수 있습니다.",
            observeAt: "verification",
          },
          {
            step: 3,
            title: "[새 탭에서 열기]로 최상위 문서에서 [앱 설치] 시도",
            description: "iframe 안에서는 설치 프롬프트가 오지 않을 수 있어 최상위 탭에서 열어 beforeinstallprompt 수신 여부와 점검표를 확인합니다.",
            actionBadge: "설치 프롬프트",
            observe: "수신하면 [앱 설치]가 활성화되고 prompt() → userChoice → appinstalled 순으로 이벤트 로그에 쌓입니다. 수신하지 못하면 점검표의 ✗ 항목이 원인입니다.",
            observeAt: "playground",
          },
        ]}
      />
      <PwaLab />
    </DemoContainer>
  )
}
