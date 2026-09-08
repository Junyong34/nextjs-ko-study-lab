/**
 * @fileoverview PartialPrerenderingTimelineDemo
 * 전통적 동적 라우트 vs Next.js Partial Prerendering — 정적 셸 선(先) Paint
 *
 * Next 16 기준: PPR은 `cacheComponents: true`로 켠다. `experimental.ppr` 플래그와 세그먼트 옵션
 * `experimental_ppr`은 16에서 제거됐다 (`02-guides/upgrading/version-16.md:582`).
 * 정적 셸은 "CDN에서 직접 서빙"된다 (`01-getting-started/08-caching.md:454`) — Edge Runtime과는 무관하다.
 */

'use client';

import React from 'react';
import { TimelineCompareCanvas } from '../components/TimelineCompareCanvas';
import type { TimelineCompareSpec } from '../components/timeline';

const spec: TimelineCompareSpec = {
  totalMs: 600,
  metricLabel: '첫 Paint',
  legends: [
    { kind: 'block', label: '전체 동적 연산' },
    { kind: 'cache', label: 'CDN 정적 셸' },
    { kind: 'network', label: '동적 홀 스트리밍' },
    { kind: 'render', label: '브라우저 페인트' },
    { kind: 'idle', label: '홀 대기' }
  ],
  before: {
    variant: 'before',
    title: '전통적 동적 라우트 — 통째로 동적',
    statusLabel: '전부 동적',
    summary:
      '쿠키를 한 줄 읽었다는 이유로 페이지 전체가 동적으로 분류된다. 바뀌지 않는 헤더·상품 정보까지 매 요청마다 서버에서 다시 만든다.',
    tasks: [
      {
        id: 'b-dynamic',
        label: '전체 동적 렌더',
        startMs: 0,
        durationMs: 400,
        kind: 'block',
        detail:
          '셸 + 쿠키 조회 + 장바구니 조회를 매 요청마다 함께 계산한다. 캐시할 수 있는 부분까지 400ms를 기다린다.'
      },
      {
        id: 'b-send',
        label: '전송',
        startMs: 400,
        durationMs: 20,
        kind: 'network',
        detail: '연산이 모두 끝난 뒤 완성된 HTML을 전송한다.'
      },
      {
        id: 'b-paint',
        label: '페인트',
        startMs: 420,
        durationMs: 10,
        kind: 'render',
        detail: '첫 픽셀이 430ms에야 나타난다.'
      }
    ],
    events: [
      {
        id: 'b-fp',
        label: '첫 Paint',
        kind: 'paint',
        arriveMs: 0,
        handledMs: 430,
        detail: '요청 순간부터 첫 픽셀까지'
      }
    ],
    completeMs: 430,
    metricMs: 430
  },
  after: {
    variant: 'after',
    title: 'PPR — 정적 셸 먼저, 홀은 나중에 (cacheComponents)',
    statusLabel: '홀 스트리밍',
    summary:
      '빌드 타임에 만든 정적 셸이 CDN에서 20ms 만에 페인트되고, 동적인 장바구니 구멍(Hole)만 같은 응답 안에서 뒤이어 스트리밍된다. Next 16에서는 next.config의 cacheComponents: true가 이 동작을 켠다 — experimental.ppr 플래그와 세그먼트 옵션 experimental_ppr은 16에서 제거됐다.',
    tasks: [
      {
        id: 'a-edge',
        label: 'CDN 셸',
        startMs: 0,
        durationMs: 14,
        kind: 'cache',
        detail: '빌드 시 생성된 정적 셸을 CDN 캐시에서 그대로 꺼낸다. 업스트림 서버를 타지 않아 서버 연산이 0이다. (Edge Runtime과는 다른 이야기다 — 그 런타임은 16에서 deprecated다)'
      },
      {
        id: 'a-paint',
        label: '셸 페인트',
        startMs: 14,
        durationMs: 6,
        kind: 'render',
        detail: '20ms에 레이아웃·상품 정보가 화면에 나타난다. 여기가 첫 Paint다.'
      },
      {
        id: 'a-hole-wait',
        label: '홀 대기',
        startMs: 20,
        durationMs: 330,
        kind: 'idle',
        detail: '장바구니 자리에는 fallback이 놓여 있고, 그동안 화면은 이미 조작 가능하다.'
      },
      {
        id: 'a-hole',
        label: '동적 홀',
        startMs: 350,
        durationMs: 90,
        kind: 'network',
        detail: '쿠키가 필요한 장바구니 조각만 서버에서 계산해 스트리밍한다.'
      },
      {
        id: 'a-fill',
        label: '홀 채움',
        startMs: 440,
        durationMs: 40,
        kind: 'render',
        detail: 'fallback 자리에 실제 장바구니가 끼워진다.'
      }
    ],
    yieldPointsMs: [20],
    events: [
      {
        id: 'a-fp',
        label: '첫 Paint',
        kind: 'paint',
        arriveMs: 0,
        handledMs: 20,
        detail: '정적 셸 덕분에 20ms 만에 첫 픽셀이 나온다'
      },
      {
        id: 'a-cart',
        label: '장바구니',
        kind: 'paint',
        arriveMs: 0,
        handledMs: 480,
        detail: '동적인 부분만 늦게 채워진다'
      }
    ],
    completeMs: 20,
    metricMs: 20
  }
};

export const PartialPrerenderingTimelineDemo: React.FC = () => <TimelineCompareCanvas spec={spec} />;
