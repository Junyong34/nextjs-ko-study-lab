/**
 * @fileoverview StreamingSsrTimelineDemo
 * 전통적 일괄 SSR vs Next.js Streaming SSR with Suspense — 공유 시간축 비교
 */

'use client';

import React from 'react';
import { TimelineCompareCanvas } from '../components/TimelineCompareCanvas';
import type { TimelineCompareSpec } from '../components/timeline';

const spec: TimelineCompareSpec = {
  totalMs: 2400,
  metricLabel: '첫 화면(FCP)',
  legends: [
    { kind: 'block', label: '응답 차단' },
    { kind: 'work', label: '서버 렌더' },
    { kind: 'network', label: '네트워크 청크' },
    { kind: 'render', label: '브라우저 페인트' },
    { kind: 'idle', label: '스트림 유지' }
  ],
  before: {
    variant: 'before',
    title: '일괄 SSR — 전부 기다린다',
    statusLabel: '응답 차단',
    summary:
      '서버가 셸과 추천 API를 한 덩어리로 처리한다. 가장 느린 fetch가 끝날 때까지 첫 바이트조차 나가지 못해, 사용자는 2초 내내 빈 화면을 본다.',
    tasks: [
      {
        id: 'b-block',
        label: '전체 대기',
        startMs: 0,
        durationMs: 2000,
        kind: 'block',
        detail:
          '셸 렌더와 추천상품 API(2초)가 하나의 응답에 묶여 있다. 빠르게 준비된 헤더·레이아웃도 함께 붙잡혀 전송되지 못한다.'
      },
      {
        id: 'b-send',
        label: 'HTML 전송',
        startMs: 2000,
        durationMs: 90,
        kind: 'network',
        detail: '2초가 지난 뒤에야 완성된 HTML 문서 전체가 한 번에 전송된다.'
      },
      {
        id: 'b-paint',
        label: '페인트',
        startMs: 2090,
        durationMs: 60,
        kind: 'render',
        detail: '브라우저가 페이지 전체를 한 번에 그린다. 이 순간이 곧 첫 화면이다.'
      }
    ],
    events: [
      {
        id: 'b-shell',
        label: '셸 표시',
        kind: 'paint',
        arriveMs: 0,
        handledMs: 2150,
        detail: '헤더와 레이아웃이 화면에 나타나기까지 걸린 시간'
      },
      {
        id: 'b-reco',
        label: '추천 영역',
        kind: 'paint',
        arriveMs: 0,
        handledMs: 2150,
        detail: '추천 카드가 나타나기까지 걸린 시간'
      }
    ],
    completeMs: 2150,
    metricMs: 2150
  },
  after: {
    variant: 'after',
    title: 'Streaming SSR — 준비된 것부터',
    statusLabel: '스트림 중',
    summary:
      '정적 셸을 먼저 flush 해 150ms 만에 스켈레톤을 띄우고, HTTP 스트림을 열어 둔 채 느린 청크가 도착하면 그 자리만 교체한다. 느린 API는 여전히 2초지만 첫 화면은 기다리지 않는다.',
    tasks: [
      {
        id: 'a-shell',
        label: '셸 렌더',
        startMs: 0,
        durationMs: 110,
        kind: 'work',
        detail: '헤더·네비게이션 등 데이터가 필요 없는 정적 셸을 먼저 만든다.'
      },
      {
        id: 'a-flush',
        label: '셸 flush',
        startMs: 110,
        durationMs: 40,
        kind: 'network',
        detail: '완성을 기다리지 않고 셸과 Suspense fallback을 먼저 내보낸다.'
      },
      {
        id: 'a-skeleton',
        label: '스켈레톤',
        startMs: 150,
        durationMs: 30,
        kind: 'render',
        detail: '브라우저가 셸과 로딩 스켈레톤을 180ms에 페인트한다. 여기서 첫 화면이 완성된다.'
      },
      {
        id: 'a-hold',
        label: '스트림 유지',
        startMs: 180,
        durationMs: 1900,
        kind: 'idle',
        detail: '연결을 끊지 않고 열어 둔다. 메인 스레드는 비어 있어 사용자 조작에 계속 반응한다.'
      },
      {
        id: 'a-chunk',
        label: '청크 도착',
        startMs: 2080,
        durationMs: 140,
        kind: 'network',
        detail: '느린 API가 끝나면 그 조각만 인라인 스크립트 청크로 스트리밍된다.'
      },
      {
        id: 'a-swap',
        label: 'UI 교체',
        startMs: 2220,
        durationMs: 80,
        kind: 'render',
        detail: '스켈레톤 자리에 실제 추천 카드가 끼워진다. 페이지 전체를 다시 그리지 않는다.'
      }
    ],
    yieldPointsMs: [180],
    events: [
      {
        id: 'a-shell-paint',
        label: '셸 표시',
        kind: 'paint',
        arriveMs: 0,
        handledMs: 180,
        detail: '헤더와 레이아웃이 화면에 나타나기까지 걸린 시간'
      },
      {
        id: 'a-reco-paint',
        label: '추천 영역',
        kind: 'paint',
        arriveMs: 0,
        handledMs: 2300,
        detail: '느린 API에 묶인 영역만 늦게 채워진다'
      }
    ],
    completeMs: 180,
    metricMs: 180
  }
};

export const StreamingSsrTimelineDemo: React.FC = () => <TimelineCompareCanvas spec={spec} />;
