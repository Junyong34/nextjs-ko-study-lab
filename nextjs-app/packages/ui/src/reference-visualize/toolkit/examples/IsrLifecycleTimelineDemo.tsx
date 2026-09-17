/**
 * @fileoverview IsrLifecycleTimelineDemo
 * 캐시 만료 시 블로킹 재생성 vs ISR stale-while-revalidate — 두 번째 방문자가 겪는 시간
 *
 * 모델 주의: 이 데모는 `export const revalidate` 기준의 **이전 모델**(cacheComponents 미사용)이다.
 * 동작 서술은 next@16.3.2에서도 유효하지만(`02-guides/incremental-static-regeneration.md:100-101`),
 * `cacheComponents: true`를 켜면 `revalidate` 세그먼트 옵션은 제거되고 `cacheLife`가 그 역할을 한다
 * (`03-api-reference/03-file-conventions/02-route-segment-config/index.md:19`).
 */

'use client';

import React from 'react';
import { TimelineCompareCanvas } from '../components/TimelineCompareCanvas';
import type { TimelineCompareSpec } from '../components/timeline';

const spec: TimelineCompareSpec = {
  totalMs: 3200,
  metricLabel: '두 번째 방문자 응답',
  legends: [
    { kind: 'cache', label: '캐시 조회·교체' },
    { kind: 'block', label: '블로킹 재생성' },
    { kind: 'render', label: '구버전 즉시 응답' },
    { kind: 'idle', label: '백그라운드 재생성' },
    { kind: 'network', label: '응답 전송' }
  ],
  before: {
    variant: 'before',
    title: '만료 즉시 재생성 — 기다렸다 준다 (이전 모델)',
    statusLabel: '캐시 미스',
    summary:
      '캐시가 만료된 직후 도착한 방문자가 재생성 비용을 대신 낸다. 3초짜리 서버 렌더가 끝날 때까지 그 요청은 붙잡혀 있다.',
    tasks: [
      {
        id: 'b-expire',
        label: '캐시 만료',
        startMs: 0,
        durationMs: 100,
        kind: 'cache',
        detail: 'export const revalidate 시간이 지나 캐시 엔트리가 무효화된다. (이전 모델 기준 — Cache Components에서는 cacheLife의 revalidate 값이 이 역할을 한다)'
      },
      {
        id: 'b-regen',
        label: '서버 렌더 (블로킹)',
        startMs: 100,
        durationMs: 2900,
        kind: 'block',
        detail:
          '만료 직후 도착한 방문자의 요청이 재생성을 트리거하고, 그 요청 자체가 3초 동안 응답을 받지 못한다.'
      },
      {
        id: 'b-send',
        label: '응답',
        startMs: 3000,
        durationMs: 100,
        kind: 'network',
        detail: '재생성이 끝나고서야 새 HTML이 전송된다.'
      }
    ],
    events: [
      {
        id: 'b-user2',
        label: '방문자 요청',
        kind: 'paint',
        arriveMs: 100,
        handledMs: 3100,
        detail: '운 나쁘게 만료 직후 들어온 요청이 3초를 기다린다'
      }
    ],
    completeMs: 3100,
    metricMs: 3000
  },
  after: {
    variant: 'after',
    title: 'ISR — 구버전 먼저, 갱신은 뒤에서 (이전 모델)',
    statusLabel: 'stale 응답',
    summary:
      '만료됐어도 캐시에 남아 있는 구버전을 0ms에 그대로 돌려준다. 재생성은 응답과 무관하게 백그라운드에서 돌고, 끝나면 다음 방문자부터 새 버전을 받는다. 이 화면은 export const revalidate 기준의 이전 모델이다 — cacheComponents: true를 켜면 revalidate 세그먼트 옵션은 16.0.0에서 제거되고, 같은 역할을 use cache + cacheLife가 맡는다.',
    tasks: [
      {
        id: 'a-expire',
        label: '캐시 만료',
        startMs: 0,
        durationMs: 100,
        kind: 'cache',
        detail: 'revalidate 시간이 지났지만 구버전 엔트리는 그대로 남아 있다. 응답 헤더 x-nextjs-cache로 치면 STALE이다.'
      },
      {
        id: 'a-stale',
        label: '구버전 즉시 응답',
        startMs: 100,
        durationMs: 60,
        kind: 'render',
        detail: '방문자는 기다리지 않고 캐시된 구버전을 곧바로 받는다. 체감 지연이 0ms다.'
      },
      {
        id: 'a-regen',
        label: '백그라운드 재생성',
        startMs: 160,
        durationMs: 2600,
        kind: 'idle',
        detail: '재생성은 응답 경로 밖에서 돈다. 어떤 방문자도 이 시간을 기다리지 않는다.'
      },
      {
        id: 'a-swap',
        label: '새 캐시 교체',
        startMs: 2760,
        durationMs: 140,
        kind: 'cache',
        detail: '완성된 새 버전이 캐시에 올라가고, 다음 방문자부터 새 내용을 본다.'
      }
    ],
    yieldPointsMs: [160],
    events: [
      {
        id: 'a-user2',
        label: '방문자 요청',
        kind: 'paint',
        arriveMs: 100,
        handledMs: 100,
        detail: '캐시에 남은 구버전을 즉시 반환한다'
      }
    ],
    completeMs: 160,
    metricMs: 0
  }
};

export const IsrLifecycleTimelineDemo: React.FC = () => <TimelineCompareCanvas spec={spec} />;
