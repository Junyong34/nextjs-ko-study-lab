'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useNavTiming } from './NavTimingProvider'
import { evaluate, firstFeedbackMs, totalMs } from '../verification'
import { SERVER_DELAY_MS, VARIANTS, VARIANT_LABEL } from '../types'

const TREE = `loading-skeleton/layout.tsx        ← 공유 layout (측정기·링크, 전환 중 유지)
├─ with-loading/
│   └─ <Suspense fallback={<loading.tsx/>}>   ← 클릭 즉시 표시되는 경계
│        └─ page.tsx (await ${SERVER_DELAY_MS}ms)
└─ without-loading/
     └─ page.tsx (await ${SERVER_DELAY_MS}ms)   ← 경계 없음: 끝날 때까지 이전 화면 유지`

export function VerificationFooter() {
  const { results } = useNavTiming()
  const withRun = results['with-loading']
  const withoutRun = results['without-loading']
  const verdict = evaluate(withRun, withoutRun)

  const actual = (
    <div className="space-y-1">
      {VARIANTS.map((v) => {
        const m = results[v]
        return (
          <div key={v}>
            • {VARIANT_LABEL[v]}:{' '}
            {m
              ? `첫 피드백 ${firstFeedbackMs(m)}ms / 최종 ${totalMs(m)}ms / 스켈레톤 ${m.skeletonAt === null ? '없음' : '있음'} / 서버 ${m.serverMs}ms / prefetch ${m.prefetchBeforeClick}건·${m.prefetchBytes}B (${m.mode})`
              : '측정 전'}
          </div>
        )
      })}
      <div className="pt-1 text-[11px] opacity-80">{verdict.reasons.join(' ')}</div>
    </div>
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="클릭→첫 피드백 vs 전체 완료 시간"
        expected={
          <div className="space-y-1">
            <div>• 있음: 스켈레톤이 최종 콘텐츠보다 먼저 등장</div>
            <div>• 없음: 스켈레톤 없이 최종 콘텐츠가 첫 피드백</div>
            <div>• 첫 피드백: 있음 &lt; 없음</div>
            <div>• 전체 완료: 두 경로 모두 ≥ 서버 대기(약 {SERVER_DELAY_MS}ms)</div>
            <div>• production만: 클릭 전 prefetch 응답 크기 있음 &gt; 없음</div>
            <div>• development: 자동 prefetch 없음(0건, 판정 제외)</div>
          </div>
        }
        actual={actual}
        isMatched={verdict.isMatched}
        description="loading.tsx는 서버 대기를 줄이지 않습니다. 줄어드는 것은 '클릭 후 화면이 반응하기까지의 시간'입니다. 두 경로를 각각 클릭해 실측값으로 확인하세요."
      />
      <DemoDeepDiveCard title="가이드 관점: 체감 즉시 전환은 '첫 피드백'을 앞당기는 것" className="min-w-0">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 두 개의 시계: 첫 피드백과 전체 완료</h5>
            <p>
              Instant navigation 가이드는 &quot;클릭하는 순간 새 화면 렌더링이 시작되고, 정적·fallback 콘텐츠가 바로 보이며 나머지는
              스트리밍되는 것&quot;을 즉시 전환으로 정의합니다. 이 데모의 두 경로는 서버 대기 시간이 같으므로 전체 완료 시간도
              비슷합니다. 차이는 첫 피드백입니다. loading.tsx가 없으면 page 전체가 준비될 때까지 이전 화면이 그대로 남아
              사용자는 클릭이 먹혔는지 알 수 없습니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 파일 트리와 Suspense 경계 위치</h5>
            <pre className="overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-200">{TREE}</pre>
            <p className="mt-1">
              loading.tsx는 같은 폴더의 page.tsx(와 하위 세그먼트)를 &lt;Suspense&gt;로 감싸고, 같은 폴더의 layout.tsx는 감싸지
              않습니다. 공유 layout은 전환 중에도 유지되어 링크와 측정표가 계속 동작합니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. dev와 production의 차이 (prefetch)</h5>
            <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
              <li>자동 prefetch는 production에서만 동작합니다. dev에서는 클릭 후 서버가 첫 청크(스켈레톤)를 보내야 스켈레톤이 뜨므로 서버 왕복만큼 늦습니다.</li>
              <li>Cache Components 없이 동적 page는 기본 prefetch 대상이 아니지만, loading.tsx가 있으면 &quot;layout부터 첫 loading 경계까지&quot;를 prefetch합니다. 그래서 production에서는 스켈레톤이 서버 왕복 없이 거의 즉시 나타납니다.</li>
              <li>loading.tsx가 없는 동적 page는 세그먼트 데이터가 prefetch되지 않아, 클릭 후 서버 대기 전체를 기다립니다.</li>
              <li>Next.js 16에서는 두 링크 모두 경로 트리 prefetch 요청이 나가므로 &quot;요청 수&quot;로는 구분되지 않습니다. 측정표의 응답 크기(Resource Timing의 decodedBodySize)에서 loading 경계까지의 데이터가 더 실려 오는 차이를 봅니다. 요청 헤더·응답 형식은 프레임워크 내부 구현이므로 학습 대상은 &quot;결과로 스켈레톤이 왕복 없이 뜬다&quot;는 점입니다.</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 체크리스트</h5>
            <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
              <li>느린 데이터를 읽는 page에는 최종 레이아웃과 같은 골격의 loading.tsx를 둬 레이아웃 이동을 줄입니다.</li>
              <li>layout.tsx에서 uncached 데이터나 cookies()/headers()를 읽으면 Cache Components 없이는 loading.tsx가 있어도 전환이 막힙니다. 느린 읽기는 page나 하위 &lt;Suspense&gt;로 옮깁니다.</li>
              <li>경계를 두기 어려운 경로라면 useLinkStatus로 링크 자체에 대기 표시를 주는 방법도 있습니다.</li>
              <li>Cache Components를 쓰는 앱에서는 static shell과 prefetch 설정으로 같은 목표를 더 세밀하게 다룹니다(가이드 원문 참고).</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
