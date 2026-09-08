/**
 * @fileoverview SelectiveHydrationTimelineDemo
 * 일괄 하이드레이션 vs React 선택적 수화 — 클릭이 언제 응답받는가
 */

'use client';

import React from 'react';
import { TimelineCompareCanvas } from '../components/TimelineCompareCanvas';
import type { TimelineCompareSpec } from '../components/timeline';

const spec: TimelineCompareSpec = {
  totalMs: 1600,
  metricLabel: '클릭 응답(INP)',
  legends: [
    { kind: 'block', label: '블로킹 수화' },
    { kind: 'work', label: '컴포넌트 수화' },
    { kind: 'input', label: '클릭 처리' },
    { kind: 'render', label: '반응 렌더' }
  ],
  before: {
    variant: 'before',
    title: '일괄 하이드레이션 — 순서대로',
    statusLabel: '수화 점유',
    summary:
      '트리를 위에서부터 통째로 수화한다. 400ms에 누른 댓글 버튼은 자기 차례가 올 때까지 이벤트 큐에서 840ms를 기다린다.',
    tasks: [
      {
        id: 'b-side',
        label: '사이드바',
        startMs: 0,
        durationMs: 300,
        kind: 'work',
        detail: '먼저 선언된 순서대로 사이드바부터 수화한다.'
      },
      {
        id: 'b-feed',
        label: '피드',
        startMs: 300,
        durationMs: 420,
        kind: 'work',
        detail: '가장 무거운 피드가 메인 스레드를 계속 점유한다. 이 사이에 클릭이 들어와도 멈추지 않는다.'
      },
      {
        id: 'b-comment',
        label: '댓글창',
        startMs: 720,
        durationMs: 520,
        kind: 'block',
        detail: '마지막 차례가 되어서야 댓글창이 수화된다. 이 시점에야 눌러 둔 클릭이 처리된다.'
      }
    ],
    events: [
      {
        id: 'b-click',
        label: '댓글 클릭',
        kind: 'input',
        arriveMs: 400,
        handledMs: 1240,
        detail: '사용자가 400ms에 누른 클릭이 큐에서 840ms 대기한 뒤 처리된다'
      }
    ],
    completeMs: 1240,
    metricMs: 840
  },
  after: {
    variant: 'after',
    title: 'Selective Hydration — 만진 곳부터',
    statusLabel: '우선순위 점프',
    summary:
      '클릭이 들어온 순간 진행 중이던 피드 수화를 중단하고, 사용자가 만진 서브트리로 우선순위를 옮긴다. 나머지는 그 뒤에 이어서 수화한다.',
    tasks: [
      {
        id: 'a-side',
        label: '사이드바',
        startMs: 0,
        durationMs: 300,
        kind: 'work',
        detail: '동일하게 사이드바부터 수화를 시작한다.'
      },
      {
        id: 'a-feed-1',
        label: '피드',
        startMs: 300,
        durationMs: 100,
        kind: 'work',
        detail: '피드 수화 도중 400ms에 클릭이 도착한다.'
      },
      {
        id: 'a-comment',
        label: '댓글창',
        startMs: 400,
        durationMs: 90,
        kind: 'input',
        detail: '클릭한 서브트리를 가로채 먼저 수화한다. 90ms 만에 클릭이 응답된다.'
      },
      {
        id: 'a-feed-2',
        label: '피드 재개',
        startMs: 490,
        durationMs: 260,
        kind: 'work',
        detail: '급한 일이 끝났으니 중단했던 피드 수화를 이어서 진행한다.'
      },
      {
        id: 'a-rest',
        label: '나머지',
        startMs: 750,
        durationMs: 300,
        kind: 'work',
        detail: '남은 하위 컴포넌트를 여유 있게 수화한다.'
      }
    ],
    yieldPointsMs: [400],
    events: [
      {
        id: 'a-click',
        label: '댓글 클릭',
        kind: 'input',
        arriveMs: 400,
        handledMs: 490,
        detail: '클릭 즉시 해당 서브트리를 수화해 90ms 만에 반응한다'
      }
    ],
    completeMs: 490,
    metricMs: 90
  }
};

export const SelectiveHydrationTimelineDemo: React.FC = () => <TimelineCompareCanvas spec={spec} />;
