/**
 * @fileoverview showcase-timeline-demos Data
 * Next.js 6대 핵심 기술 타임라인 비교 데모 메타데이터.
 * 6종 모두 하나의 공유 시간축 위에서 Before/After 레인을 나란히 재생한다.
 */

import React from 'react';
import type { DemoMeta } from './showcase-types';
import { StreamingSsrTimelineDemo } from './StreamingSsrTimelineDemo';
import { SelectiveHydrationTimelineDemo } from './SelectiveHydrationTimelineDemo';
import { PartialPrerenderingTimelineDemo } from './PartialPrerenderingTimelineDemo';
import { ConcurrentTransitionsTimelineDemo } from './ConcurrentTransitionsTimelineDemo';
import { OptimisticUiTimelineDemo } from './OptimisticUiTimelineDemo';
import { IsrLifecycleTimelineDemo } from './IsrLifecycleTimelineDemo';

const TIMELINE_MODULES = [
  'TimelineCompareCanvas',
  'createTimeScale',
  'simulateLane',
  'paintEventFlow',
  'paintYieldSparks',
  'paintDeltaBracket'
];

const snippet = (title: string, body: string) => `// ${title}
<TimelineCompareCanvas
  spec={{
    totalMs: ${body},
    before: { /* 절대 시각 태스크 + 이벤트(arriveMs → handledMs) */ },
    after: { /* 같은 시간축, 훨씬 왼쪽에서 끝난다 */ }
  }}
/>`;

export const timelineDemos: DemoMeta[] = [
  {
    key: 'streaming-timeline',
    group: 'timeline',
    layout: 'wide',
    title: 'Streaming SSR with Suspense',
    category: 'Next.js · Streaming',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    description:
      '두 레인이 같은 시간축을 공유합니다. 일괄 SSR은 2,150ms까지 이어지지만, 스트리밍 레인은 180ms에 완료 지점을 표시하고 나머지 구간은 스트림을 연 채 비워 둡니다.',
    gridDescription: '일괄 SSR 2,150ms vs 셸 스트리밍 180ms — 첫 화면까지의 길이 비교',
    modules: TIMELINE_MODULES,
    code: snippet('Streaming SSR — 셸부터 flush', '2400, metricLabel: \'첫 화면(FCP)\''),
    component: <StreamingSsrTimelineDemo />
  },
  {
    key: 'hydration-timeline',
    group: 'timeline',
    layout: 'wide',
    title: 'Selective Hydration',
    category: 'Next.js · Concurrency',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description:
      '400ms에 도착한 클릭이 언제 처리되는지 대기 막대로 보여줍니다. 일괄 수화 레인에서는 840ms짜리 빨간 막대가 길게 이어지고, 선택적 수화 레인에서는 90ms 만에 끝납니다.',
    gridDescription: '클릭 대기 840ms vs 90ms — 우선순위 점프의 효과',
    modules: TIMELINE_MODULES,
    code: snippet('Selective Hydration — 만진 곳 우선', '1600, metricLabel: \'클릭 응답(INP)\''),
    component: <SelectiveHydrationTimelineDemo />
  },
  {
    key: 'ppr-timeline',
    group: 'timeline',
    layout: 'wide',
    title: 'Partial Prerendering (PPR)',
    category: 'Next.js · Rendering',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description:
      '정적 셸은 20ms에 페인트되어 완료 지점이 시간축 맨 왼쪽에 표시됩니다. 동적 홀은 그 뒤 350ms부터 스트리밍되지만 첫 화면은 이미 표시됩니다. Next 16에서는 cacheComponents: true가 이 동작을 활성화합니다. experimental.ppr은 16에서 제거됐습니다.',
    gridDescription: '전체 동적 430ms vs 정적 셸 20ms + 홀 스트리밍',
    modules: TIMELINE_MODULES,
    code: snippet('PPR — 정적 셸 선 Paint', '600, metricLabel: \'첫 Paint\''),
    component: <PartialPrerenderingTimelineDemo />
  },
  {
    key: 'transitions-timeline',
    group: 'timeline',
    layout: 'wide',
    title: 'Concurrent Transitions',
    category: 'React 19 · Concurrency',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description:
      '양보하는 렌더 레인에서는 청크 사이마다 메인 스레드 제어권을 넘겨주고, 남은 작업이 다음 태스크로 예약되는 흐름을 점선 아크 위의 파티클로 보여줍니다. 입력은 그 틈에서 16ms에 처리됩니다.',
    gridDescription: '동기 렌더 입력 지연 250ms vs 청크 양보 16ms',
    modules: TIMELINE_MODULES,
    code: snippet('startTransition — 청크마다 양보', '400, metricLabel: \'최대 입력 지연\''),
    component: <ConcurrentTransitionsTimelineDemo />
  },
  {
    key: 'optimistic-timeline',
    group: 'timeline',
    layout: 'wide',
    title: 'Optimistic UI (Server Actions)',
    category: 'Next.js · Mutation',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description:
      '클릭 이벤트의 대기 막대가 한쪽은 420ms 빨간 막대로, 다른 쪽은 점 하나로 끝납니다. 네트워크 왕복 380ms는 양쪽 다 존재하지만 한쪽만 사용자를 붙잡습니다.',
    gridDescription: '스피너 대기 420ms vs 낙관적 렌더 0ms',
    modules: TIMELINE_MODULES,
    code: snippet('useOptimistic — 화면부터 먼저', '600, metricLabel: \'클릭 → 화면 반영\''),
    component: <OptimisticUiTimelineDemo />
  },
  {
    key: 'isr-timeline',
    group: 'timeline',
    layout: 'wide',
    title: 'ISR Stale-While-Revalidate',
    category: 'Next.js · Caching',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    description:
      '재생성에 걸리는 시간은 두 레인에서 같습니다. 차이는 방문자가 그 시간을 기다리느냐(3,000ms 빨간 막대), 응답과 분리해 백그라운드에서 처리하느냐(0ms)입니다. export const revalidate 기준의 이전 모델이며, cacheComponents를 켜면 이 옵션은 제거되고 cacheLife가 대신합니다.',
    gridDescription: '캐시 미스 3,000ms 대기 vs 구버전 0ms 응답 + 백그라운드 재생성',
    modules: TIMELINE_MODULES,
    code: snippet('ISR — 구버전 먼저, 갱신은 뒤에서', '3200, metricLabel: \'두 번째 방문자 응답\''),
    component: <IsrLifecycleTimelineDemo />
  }
];
