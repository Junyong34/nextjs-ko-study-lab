'use client'
import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { BURST_SIZE } from '../lib/probe'
import { useRegisterProbe } from '../hooks/useRegisterProbe'
import { ProbePanel } from './ProbePanel'
import { VerificationFooter } from './VerificationFooter'

export function RegisterHookLab() {
  const s = useRegisterProbe()
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="서버 부팅 register() 실행 훅"
        concept="instrumentation.ts의 register()는 요청마다가 아니라 서버 인스턴스가 시작될 때 런타임별로 한 번 실행된다. 그래서 DB 풀·모니터링 SDK처럼 한 번만 만들어야 하는 초기화를 둔다. 실제 Route Handler에 연속 요청을 보내 register()가 남긴 값과 요청마다 늘어나는 대조 카운터를 나란히 재고, onRequestError가 서버 오류에서 호출되는지 확인한다."
        steps={[
          { step: 1, title: '예측', description: `${BURST_SIZE}번 요청하는 동안 registerCallCount가 어떻게 될지 고릅니다.`, actionBadge: '예측' },
          { step: 2, title: `[Node.js 핸들러 ${BURST_SIZE}회] 요청`, description: 'api/node에 연속으로 fetch합니다. 각 응답에 register()가 globalThis에 남긴 스냅샷과 핸들러 모듈의 요청 카운터가 함께 담겨 옵니다.', actionBadge: '요청 실행', observe: 'bootedAt·pid·registerCallCount는 그대로, 대조 카운터만 1씩 증가', observeAt: 'playground' },
          { step: 3, title: `[Edge 핸들러 ${BURST_SIZE}회] 요청`, description: 'runtime = edge로 선언한 api/edge에 같은 요청을 보냅니다. Edge isolate 안에서 따로 호출된 register()의 값을 Node.js와 비교합니다.', actionBadge: '런타임 비교', observe: '부팅 시각이 다르고 Edge pid는 -1', observeAt: 'playground' },
          { step: 4, title: '[오류 발생] 후 검증 패널 확인', description: '예외를 던지는 POST로 500을 일으키고 onRequestError 기록을 확인합니다. 검증 패널은 최근 동작의 실측값을 항목별로 대조합니다.', actionBadge: '결과 확인', observe: '항목별 ✅/❌', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="register() 호출 횟수 실측 실습">
        <ProbePanel
          prediction={s.prediction}
          onPredict={s.setPrediction}
          bursts={s.bursts}
          fail={s.fail}
          error={s.error}
          isPending={s.isPending}
          onBurst={s.burst}
          onFail={s.triggerError}
          onReset={s.reset}
        />
      </DemoPlaygroundCard>
      <VerificationFooter latest={s.latest} bursts={s.bursts} fail={s.fail} prediction={s.prediction} />
    </DemoContainer>
  )
}
