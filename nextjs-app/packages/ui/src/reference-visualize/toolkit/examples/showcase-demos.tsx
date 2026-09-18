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
    keywords: ['React Server Components', 'RSC 스트리밍', 'Next.js 청크 스트리밍', 'Next.js Suspense 워터폴'],
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
    keywords: ['Next.js ISR 캐시', 'Next.js revalidate 캐시 수명', 'Next.js cacheLife', 'Next.js 백그라운드 재생성'],
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
    keywords: ['Next.js App Router', 'Next.js 렌더 트리', 'Next.js 중첩 라우팅', 'RSC 렌더 순서'],
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
    keywords: ['Next.js generateMetadata', 'Next.js Metadata API', 'Next.js SEO 메타데이터', 'Next.js metadata 병합'],
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
    keywords: ['Next.js 렌더링 전략', 'SSG SSR CSR 비교', 'Next.js use cache', 'Next.js 16 렌더링'],
    component: <RenderStrategyBoundaryDemo />
  }
];

export const showcaseDemos: DemoMeta[] = [
  ...timelineDemos,
  ...architectureDemos,
  ...cacheDemos
];
