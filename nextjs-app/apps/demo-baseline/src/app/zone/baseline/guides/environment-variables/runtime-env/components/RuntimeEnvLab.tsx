'use client'
import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import type { EnvSnapshot } from '../types'
import { useRuntimeEnv } from '../hooks/useRuntimeEnv'
import { RuntimeEnvDemo } from './RuntimeEnvDemo'
import { VerificationFooter } from './VerificationFooter'

export function RuntimeEnvLab({ serverSnapshot }: { serverSnapshot: EnvSnapshot }) {
  const s = useRuntimeEnv(serverSnapshot)
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="process.env 런타임 환경변수 요청 시점 참조"
        concept="서버는 요청이 들어온 뒤 process.env를 읽으므로 실행 시점의 값을 얻지만, 브라우저 번들은 NEXT_PUBLIC_ 값이 빌드 때 인라인된 것만 갖는다. 같은 변수를 서버와 브라우저에서 동시에 읽어 그 차이를 직접 확인한다."
        steps={[
          { step: 1, title: '변수 선택과 예측', description: 'NEXT_PUBLIC_STORE_NAME, INTERNAL_ADMIN_EMAIL, NODE_ENV 중 하나를 고르고 "브라우저에서도 서버와 같은 값이 보일까?"를 예측합니다.', actionBadge: '예측' },
          { step: 2, title: '[변수 읽기]를 두 번 실행', description: '서버(Route Handler)와 브라우저가 같은 순간에 값을 읽습니다. 요청 번호와 evaluatedAt이 매번 바뀌는지 봅니다.', actionBadge: '요청 실행', observe: '요청 #번호 증가, 서버·브라우저 값 비교', observeAt: 'playground' },
          { step: 3, title: '[서버 렌더 다시 실행]', description: 'page.tsx가 await connection() 뒤에서 요청 시점에 다시 실행되어 새 시각을 내려주는지 확인합니다.', actionBadge: '서버 렌더', observe: '서버 렌더 실행 이력 증가', observeAt: 'playground' },
          { step: 4, title: '검증 패널 확인', description: '측정값과 예측을 대조합니다. INTERNAL_ADMIN_EMAIL에서 "같다"로 예측하면 실패가 표시됩니다.', actionBadge: '결과 확인', observe: '항목별 ✅/❌', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="서버·브라우저 process.env 동시 조회 실습">
        <RuntimeEnvDemo
          name={s.name}
          onNameChange={s.setName}
          prediction={s.prediction}
          onPredict={s.setPrediction}
          reads={s.reads}
          serverSnapshot={serverSnapshot}
          renderTimes={s.renderTimes}
          isPending={s.isPending}
          onRead={s.readEnv}
          onRerender={s.rerenderOnServer}
          onReset={s.reset}
        />
      </DemoPlaygroundCard>
      <VerificationFooter reads={s.reads} prediction={s.prediction} serverSnapshot={serverSnapshot} renderCount={s.renderTimes.length} />
    </DemoContainer>
  )
}
