'use client'
import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useRedirectProbes } from '../hooks/useRedirectProbes'
import { CaseTable } from './CaseTable'
import { CustomProbe } from './CustomProbe'
import { RuleTable } from './RuleTable'
import { VerificationFooter } from './VerificationFooter'

export function RedirectsRegexLab() {
  const s = useRedirectProbes()
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="redirects() 정규식 패턴 및 와일드카드 리다이렉트"
        concept="next.config의 redirects()는 path-to-regexp 패턴으로 요청 경로를 비교한다. 일치하면 서버가 3xx 응답과 Location을 보내고, 일치하지 않으면 리다이렉트 없이 평소처럼 라우팅한다. 이 화면은 서버가 같은 앱에 보낸 요청의 실제 응답을 읽어 보여준다."
        steps={[
          { step: 1, title: '등록된 규칙 읽기', description: ':year(\\d{4}), :path*, (en|ko|ja), \\( \\) 이스케이프 네 가지 규칙을 확인합니다.', actionBadge: '규칙 확인' },
          { step: 2, title: '예측 후 [요청]', description: '경로마다 308 / 307 / 일치 안 함(404) 중 하나를 예측하고 요청합니다. 예측은 선택 사항입니다.', actionBadge: '요청', observe: '실측 상태 코드와 Location', observeAt: 'playground' },
          { step: 3, title: '[전체 요청]으로 나머지 실행', description: '일치하는 경로와 정규식에서 어긋나는 경로를 모두 실행해 불일치 시 리다이렉트되지 않는지 봅니다.', actionBadge: '전체 요청', observe: '9개 케이스의 일치/불일치 표시', observeAt: 'playground' },
          { step: 4, title: '검증 패널 확인', description: '측정값을 문서 기준 기대와 대조합니다. 틀린 예측이 있으면 불일치로 표시됩니다.', actionBadge: '결과 확인', observe: '항목별 판정', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="src/config/demo-next-config/redirects-regex.ts · probe/route.ts">
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <RuleTable />
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={s.runAll}
              disabled={s.pendingId !== null}
              className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {s.pendingId === 'all' ? '요청 중...' : '전체 요청 (9개)'}
            </button>
            <span className="text-xs text-zinc-500">실행 {s.summary.ran} / {s.summary.total}</span>
            <DemoResetButton onReset={s.reset} className="ml-auto" />
          </div>
          <CaseTable outcomes={s.outcomes} predictions={s.predictions} pendingId={s.pendingId} onPredict={s.predict} onRun={s.run} />
          <CustomProbe path={s.customPath} onPathChange={s.setCustomPath} outcome={s.custom} busy={s.pendingId !== null} onRun={() => s.run('custom', s.customPath)} />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter summary={s.summary} />
    </DemoContainer>
  )
}
