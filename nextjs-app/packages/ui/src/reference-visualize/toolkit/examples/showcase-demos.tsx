/**
 * @fileoverview showcase-demos Data Definition
 * Composed Showcase에서 제공하는 전체 실전 데모들의 메타데이터 및 컴포넌트 매핑
 */

import React from 'react';
import { cacheDemos } from './showcase-cache-demos';
import { timelineDemos } from './showcase-timeline-demos';
import { RscStreamingWaterfallDemo } from './RscStreamingWaterfallDemo';
import { IsrCacheLifecycleDemo } from './IsrCacheLifecycleDemo';
import { AppRouterRenderTreeDemo } from './AppRouterRenderTreeDemo';
import { MetadataResolutionDemo } from './MetadataResolutionDemo';
import { RenderStrategyBoundaryDemo } from './RenderStrategyBoundaryDemo';

import type { DemoKey, DemoGroup, DemoMeta } from './showcase-types';
export type { DemoKey, DemoGroup, DemoMeta };

export const groupLabels: Record<DemoGroup, string> = {
  timeline: 'Next.js 타임라인 비교 (Before vs After)',
  nextjs: 'Next.js 인터랙티브 구조',
  'cache-components': 'Cache Components',
  generic: '범용 모듈 결합'
};

export const groupOrder: DemoGroup[] = ['timeline', 'nextjs', 'cache-components'];

const architectureDemos: DemoMeta[] = [
  {
    key: 'streaming-waterfall',
    group: 'nextjs',
    layout: 'wide',
    title: 'RSC Streaming Waterfall',
    category: 'Next.js · Streaming',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    description:
      '서버가 보낸 것(좌: 청크 워터폴)과 사용자가 본 것(우: 브라우저 화면)을 같은 시각축에 나란히 둡니다. 각 청크의 도착 시각이 숫자로 남고, 도착하는 순간 해당 칸의 스켈레톤이 실제 콘텐츠로 교체됩니다.',
    gridDescription: '청크 도착 시각 워터폴 + 빈 화면 → 스켈레톤 → 콘텐츠로 채워지는 브라우저 화면',
    modules: ['paintWaterfall', 'paintBrowserViewport', 'useTimelinePlayback', 'fitLabel', 'StructureNotes'],
    code: `// 서버 청크와 사용자 화면을 같은 시각축에 둔다
paintWaterfall(ctx, { panel: left, chunks, totalMs, firstPaintMs, nowMs });
paintBrowserViewport(ctx, { panel: right, slots, chunks, firstPaintMs, nowMs });
// 슬롯 상태: nowMs < firstPaint ? 'blank' : 청크 도착 전 'skeleton' : 'filled'`,
    component: <RscStreamingWaterfallDemo />
  },
  {
    key: 'isr-cache',
    group: 'nextjs',
    layout: 'wide',
    title: 'ISR Cache Lifecycle',
    category: 'Next.js · Caching',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    description:
      '요청은 자동으로 발생하지 않으며 직접 보냅니다. 만료 뒤 첫 요청은 기존 버전을 0ms에 받고, 동시에 백그라운드 재생성을 시작합니다. 이 인과 관계를 화살표로 보여줍니다. export const revalidate 기준의 이전 모델이며, cacheComponents에서는 cacheLife가 그 역할을 합니다.',
    gridDescription: '캐시 나이 트랙 + 요청 마커(HIT/STALE) + 재생성 음영 밴드와 인과 화살표',
    modules: ['paintCacheTrack', 'paintIsrPipeline', 'drawLineArrowHead', 'hitTestRequests', 'StructureNotes'],
    code: `// STALE 요청이 재생성을 트리거한 사실을 남긴다
if (isStale && !regenerating) bands.push({ startSec: now, endSec: null, triggeredBy: req.id });
paintCacheTrack(ctx, { panel, spec, runtime });   // 밴드는 끝난 뒤에도 남는다
paintIsrPipeline(ctx, { panel, isStale, isRegenerating, requestPulse });`,
    component: <IsrCacheLifecycleDemo />
  },
  {
    key: 'render-tree',
    group: 'nextjs',
    layout: 'wide',
    title: 'App Router Render Tree',
    category: 'Next.js · Routing',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
    description:
      'URL 세그먼트, 중첩 구조, 렌더 순서 세 가지를 하나로 연결합니다. 자식이 부모 안에 실제로 들어간 모양의 중첩 상자로 표현하며, 재생하면 RSC 셸 → Suspense 스트리밍 → 클라이언트 수화 순서로 나타납니다.',
    gridDescription: 'URL 세그먼트 ↔ 중첩 박스 ↔ 렌더 순서 3단계 재생',
    modules: ['buildTreeBoxes', 'paintTree', 'nodeStateAt', 'hiddenNodeIds', 'drawStepIndicator'],
    code: `// 자식은 부모 안쪽에 — 중첩이 중첩으로 보이게
const boxes = buildTreeBoxes(TREE, pad, top, width);
paintTree(ctx, { boxes, progress, hoveredId, timeMs });
// 부모가 아직 자리를 못 잡았으면 자식은 화면에 존재하지 않는다
hiddenNodeIds(boxes, progress);`,
    component: <AppRouterRenderTreeDemo />
  },
  {
    key: 'metadata-flow',
    group: 'nextjs',
    layout: 'wide',
    title: 'Metadata Resolution',
    category: 'Next.js · SEO',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description:
      'layout·page가 각각 export한 metadata는 루트부터 아래로 평가되어 얕은 방식으로 병합됩니다. openGraph처럼 중첩 객체를 가진 키는 한 필드만 덮어써도 객체 전체가 교체되어 앞 세그먼트의 값이 사라집니다.',
    gridDescription: '평가 순서 → 얕은 병합(덮어쓰기) → <head>, generateMetadata 스트리밍 토글',
    modules: ['resolveMetadata', 'paintSegments', 'paintHeadPanel', 'paintHandoff', 'StructureNotes'],
    code: `// 얕은 병합 — 같은 키는 병합이 아니라 교체된다
for (const previous of entries) {
  if (previous.key !== entry.key || previous.overriddenBy) continue;
  previous.overriddenBy = segment.id;              // 앞 값은 죽는다
  previous.lostNested = previous.nestedFields      // openGraph.description 등이 사라진다
    ?.filter((field) => !(entry.nested ?? []).includes(field));
}`,
    component: <MetadataResolutionDemo />
  },
  {
    key: 'render-strategy',
    group: 'nextjs',
    layout: 'wide',
    title: 'Render Strategy Boundary',
    category: 'Next.js 16 · Rendering',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    description:
      '블록의 세로 위치가 곧 실행 위치입니다. SSG·SSR·CSR은 라우트 단위로 하나를 고르지만, 네 번째 레인인 Next 16은 use cache와 <Suspense>로 한 페이지 안에서 정적 셸과 동적 홀을 섞습니다. 첫 로드 ↔ 이후 내비게이션 토글로 서버 HTML이 사라지는 지점도 확인할 수 있습니다.',
    gridDescription: '서버·네트워크·클라이언트 3영역 위의 4개 레인 + 첫 로드/이후 내비게이션 토글',
    modules: ['STRATEGY_LANES', 'paintStrategyLanes', 'hitTestSteps', 'AREA_COLOR', 'StructureNotes'],
    code: `// Next 16: 경계는 라우트가 아니라 컴포넌트 단위 (rendering-philosophy.md)
{ id: 'n16-shell', area: 'server',  label: '정적 셸 (CDN)', startMs: 0,  durationMs: 24 },
{ id: 'n16-paint', area: 'client',  label: '셸 페인트',      startMs: 60, durationMs: 20 },
{ id: 'n16-hole',  area: 'server',  label: '동적 홀 렌더',   startMs: 80, durationMs: 220 }`,
    component: <RenderStrategyBoundaryDemo />
  }
];

export const showcaseDemos: DemoMeta[] = [
  ...timelineDemos,
  ...architectureDemos,
  ...cacheDemos
];
