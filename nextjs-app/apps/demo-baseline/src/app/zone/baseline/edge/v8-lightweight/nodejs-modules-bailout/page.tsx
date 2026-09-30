import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'edge/v8-lightweight/nodejs-modules-bailout')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { BailoutLab } from './components/BailoutLab'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Edge Runtime의 Node.js 전용 모듈(fs) 차단"
        concept="runtime = 'edge'로 실행되는 코드는 fs 같은 Node.js 전용 모듈을 불러올 수 없고, 같은 코드를 runtime = 'nodejs'로 실행하면 정상 동작합니다. Route Handler 두 개를 실제로 호출해 차이를 봅니다."
        steps={[
          {
            step: 1,
            title: '읽을 재고 파일을 고르고 [Node.js 라우트 호출] 클릭',
            description: 'node/route.ts(runtime = nodejs)가 fs로 파일을 읽고 결과를 JSON으로 돌려줍니다.',
            actionBadge: 'Node 실행',
            observe: 'NEXT_RUNTIME=nodejs, fs 모듈 로드 성공, 파일 읽기 성공(bytes)',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[Edge 라우트 호출] 클릭',
            description: 'edge/route.ts(runtime = edge)가 똑같은 probe.ts로 fs를 불러오려 시도합니다.',
            actionBadge: 'Edge 실행',
            observe: 'NEXT_RUNTIME=edge, typeof EdgeRuntime=string, fs 모듈 로드 차단됨',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '검증 패널 확인 후 [없는 파일]로 바꿔 다시 호출',
            description: '두 결과가 기대와 맞으면 검증 완료입니다. 없는 파일을 고르면 node가 ENOENT로 실패해 불일치가 되는데, 이는 모듈 차단과 다른 종류의 실패입니다.',
            actionBadge: '결과 검증',
            observe: '검증 완료 ↔ 불일치(node ENOENT)',
            observeAt: 'verification',
          },
        ]}
      />
      <BailoutLab />
    </DemoContainer>
  )
}
