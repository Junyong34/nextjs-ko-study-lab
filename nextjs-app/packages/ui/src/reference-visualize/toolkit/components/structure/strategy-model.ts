/**
 * @fileoverview structure/strategy-model.ts
 * CSR / SSR / SSG 세 가지 라우트 단위 모델과, **Next 16의 컴포넌트 단위 모델**을 같은 시간축에 놓는다.
 *
 * 근거 — next@16.3.2 번들 문서
 * - "the boundary between static and dynamic is at the component level, not the route level"
 *   (`02-guides/rendering-philosophy.md`) — 라우트 단위 3분류는 *다른 프레임워크의* 트레이드오프로 분류된다
 * - 정적 셸 = 초기 로드용 HTML + 클라이언트 내비게이션용 RSC Payload, CDN에서 직접 서빙
 *   (`01-getting-started/08-caching.md:444-454`)
 * - 첫 로드에서는 Client Component도 서버가 HTML로 프리렌더
 *   (`01-getting-started/05-server-and-client-components.md:105`)
 * - 이후 내비게이션은 서버 HTML 없이 클라이언트에서만 렌더 (같은 파일 `:132`)
 */

import type { RenderMode, StrategyLaneSpec } from './types';

export const AREA_COLOR = {
  server: '#3b82f6',
  network: '#8b5cf6',
  client: '#ec4899'
} as const;

export const AREA_LABEL = {
  server: '서버',
  network: '네트',
  client: '클라'
} as const;

export const MODE_TOTAL_MS: Record<RenderMode, number> = {
  'first-load': 1200,
  'client-nav': 400
};

export const MODE_LABEL: Record<RenderMode, string> = {
  'first-load': '첫 로드',
  'client-nav': '이후 내비게이션'
};

export const STRATEGY_LANES: StrategyLaneSpec[] = [
  {
    id: 'ssg',
    title: 'SSG — 빌드 타임 프리렌더',
    note: '라우트 단위',
    color: '#22c55e',
    firstPaintMs: { 'first-load': 120, 'client-nav': 70 },
    detail:
      '빌드 때 만들어 둔 HTML을 CDN이 그대로 준다. 첫 화면이 가장 빠르지만, 내용이 바뀌면 다시 빌드해야 한다.',
    steps: {
      'first-load': [
        { id: 'ssg-cdn', area: 'server', label: 'CDN 조회', startMs: 0, durationMs: 40, detail: '빌드 산출물을 캐시에서 꺼낸다. 서버 연산이 없다.' },
        { id: 'ssg-html', area: 'network', label: '완성 HTML', startMs: 40, durationMs: 60, carriesHtml: true, detail: '내용이 이미 들어 있는 HTML이 전송된다.' },
        { id: 'ssg-paint', area: 'client', label: '페인트', startMs: 100, durationMs: 20, detail: '받자마자 그린다. 120ms에 첫 화면.' },
        { id: 'ssg-js', area: 'network', label: 'JS 번들', startMs: 120, durationMs: 180, detail: '화면이 이미 보이는 동안 내려받는다.' },
        { id: 'ssg-hydrate', area: 'client', label: '수화', startMs: 300, durationMs: 140, detail: '이벤트 핸들러가 붙어 조작 가능해진다.' }
      ],
      'client-nav': [
        { id: 'ssg-rsc', area: 'client', label: '프리페치 RSC', startMs: 0, durationMs: 20, detail: '이미 프리페치해 둔 RSC Payload를 캐시에서 읽는다. 네트워크도 타지 않는다.' },
        { id: 'ssg-cnav', area: 'client', label: '렌더 + 페인트', startMs: 20, durationMs: 50, detail: '서버 HTML 없이 클라이언트가 그린다. 여기서는 SSG도 클라이언트 렌더다.' }
      ]
    }
  },
  {
    id: 'ssr',
    title: 'SSR — 요청 시 렌더',
    note: '라우트 단위',
    color: '#3b82f6',
    firstPaintMs: { 'first-load': 300, 'client-nav': 270 },
    detail:
      '요청마다 서버가 페이지 전체를 렌더한다. 항상 최신이지만 서버 작업이 끝나야 첫 바이트가 나간다.',
    steps: {
      'first-load': [
        { id: 'ssr-render', area: 'server', label: '전체 렌더', startMs: 0, durationMs: 240, detail: '요청마다 페이지 전체를 만든다. 데이터가 느리면 이 구간이 통째로 길어진다.' },
        { id: 'ssr-html', area: 'network', label: 'HTML', startMs: 200, durationMs: 120, carriesHtml: true, detail: '스트리밍이라 서버 렌더가 다 끝나기 전에 앞부분부터 나간다.' },
        { id: 'ssr-paint', area: 'client', label: '점진 페인트', startMs: 300, durationMs: 60, detail: '도착한 부분부터 그린다. 300ms에 첫 화면.' },
        { id: 'ssr-js', area: 'network', label: 'JS 번들', startMs: 360, durationMs: 160, detail: '' },
        { id: 'ssr-hydrate', area: 'client', label: '수화', startMs: 520, durationMs: 140, detail: '' }
      ],
      'client-nav': [
        { id: 'ssr-payload', area: 'server', label: 'RSC 생성', startMs: 0, durationMs: 160, detail: '서버가 HTML이 아니라 RSC Payload를 만든다.' },
        { id: 'ssr-net', area: 'network', label: 'RSC Payload', startMs: 160, durationMs: 50, detail: 'HTML이 아니다. 클라이언트가 트리를 갱신하는 데 쓰는 직렬화 데이터다.' },
        { id: 'ssr-cnav', area: 'client', label: '렌더 + 페인트', startMs: 210, durationMs: 60, detail: '클라이언트가 그린다.' }
      ]
    }
  },
  {
    id: 'csr',
    title: 'CSR — 클라이언트 전용 (SPA)',
    note: 'HTML은 오지만 비어 있음',
    color: '#ec4899',
    firstPaintMs: { 'first-load': 770, 'client-nav': 270 },
    detail:
      '서버는 정적 파일만 준다. 첫 HTML이 서버에서 오는 것은 맞지만 내용이 없는 껍데기라, JS가 실행되고 데이터를 받아온 뒤에야 화면이 생긴다.',
    steps: {
      'first-load': [
        { id: 'csr-serve', area: 'server', label: '파일 서빙', startMs: 0, durationMs: 40, detail: '렌더가 아니라 정적 파일 전달이다.' },
        { id: 'csr-shell', area: 'network', label: '빈 HTML', startMs: 40, durationMs: 50, carriesHtml: true, detail: '<div id="root"></div> 한 줄짜리 껍데기. 스트리밍이 아니라 정적 파일 한 장이다.' },
        { id: 'csr-js', area: 'network', label: 'JS 번들', startMs: 90, durationMs: 330, detail: '이 번들이 다 와야 아무것도 시작되지 않는다.' },
        { id: 'csr-boot', area: 'client', label: 'JS 실행·부팅', startMs: 420, durationMs: 110, detail: '앱이 부팅되고 나서야 무엇을 그릴지 정해진다.' },
        { id: 'csr-fetch', area: 'network', label: '데이터 fetch', startMs: 530, durationMs: 170, detail: '데이터 요청이 여기서야 출발한다. 서버 렌더였다면 이미 끝났을 왕복이다.' },
        { id: 'csr-paint', area: 'client', label: '렌더 + 페인트', startMs: 700, durationMs: 70, detail: '770ms에야 첫 화면.' }
      ],
      'client-nav': [
        { id: 'csr-route', area: 'client', label: '라우트 렌더', startMs: 0, durationMs: 40, detail: '' },
        { id: 'csr-cfetch', area: 'network', label: '데이터 fetch', startMs: 40, durationMs: 170, detail: '' },
        { id: 'csr-cpaint', area: 'client', label: '렌더 + 페인트', startMs: 210, durationMs: 60, detail: '' }
      ]
    }
  },
  {
    id: 'next16',
    title: 'Next 16 — 컴포넌트 단위 (Cache Components)',
    note: '정적 셸 + 동적 홀',
    color: '#8b5cf6',
    firstPaintMs: { 'first-load': 80, 'client-nav': 36 },
    detail:
      '정적/동적을 라우트가 아니라 컴포넌트 단위로 나눈다. use cache가 붙은 부분은 정적 셸에 들어가 CDN에서 즉시 나가고, <Suspense> 뒤의 동적 부분만 요청 시 렌더되어 이어서 스트리밍된다. 이것이 PPR이며 cacheComponents의 기본 동작이다.',
    steps: {
      'first-load': [
        { id: 'n16-shell', area: 'server', label: '정적 셸 (CDN)', startMs: 0, durationMs: 24, detail: 'use cache와 예측 가능한 값으로 만들어진 셸. 업스트림 서버를 타지 않는다.' },
        { id: 'n16-shell-net', area: 'network', label: '셸 HTML', startMs: 24, durationMs: 36, carriesHtml: true, detail: '내용이 든 셸이 먼저 나간다. 동적 자리에는 Suspense fallback이 들어 있다.' },
        { id: 'n16-paint', area: 'client', label: '셸 페인트', startMs: 60, durationMs: 20, detail: '80ms에 첫 화면. SSG에 가까운 속도다.' },
        { id: 'n16-hole', area: 'server', label: '동적 홀 렌더', startMs: 80, durationMs: 220, detail: '쿠키·요청 데이터가 필요한 부분만 요청 시 렌더한다. 셸은 이미 사용자 화면에 있다.' },
        { id: 'n16-hole-net', area: 'network', label: '홀 스트리밍', startMs: 300, durationMs: 70, detail: '같은 응답 안에서 이어서 흘러온다.' },
        { id: 'n16-swap', area: 'client', label: '홀 교체 + 수화', startMs: 370, durationMs: 120, detail: 'fallback 자리가 실제 내용으로 바뀌고 수화가 끝난다.' }
      ],
      'client-nav': [
        { id: 'n16-prefetch', area: 'client', label: '프리페치 셸 RSC', startMs: 0, durationMs: 16, detail: '정적 셸의 RSC Payload는 미리 받아 둔다.' },
        { id: 'n16-cpaint', area: 'client', label: '셸 페인트', startMs: 16, durationMs: 20, detail: '36ms에 셸이 뜬다.' },
        { id: 'n16-chole', area: 'server', label: '동적 홀 렌더', startMs: 36, durationMs: 170, detail: '' },
        { id: 'n16-cnet', area: 'network', label: '홀 RSC Payload', startMs: 206, durationMs: 50, detail: '' },
        { id: 'n16-cswap', area: 'client', label: '홀 교체', startMs: 256, durationMs: 50, detail: '' }
      ]
    }
  }
];

/** 첫 로드에서만 서버가 HTML을 만든다 — 이후 내비게이션에는 서버 HTML 단계가 없다 */
export function carriesServerHtml(mode: RenderMode): boolean {
  return mode === 'first-load';
}
