/**
 * @fileoverview OptimisticUiTimelineDemo
 * 네트워크 왕복 대기 vs useOptimistic + Server Actions — 화면 갱신을 언제 하는가
 */

'use client';

import React from 'react';
import { TimelineCompareCanvas } from '../components/TimelineCompareCanvas';
import type { TimelineCompareSpec } from '../components/timeline';

const spec: TimelineCompareSpec = {
  totalMs: 600,
  metricLabel: '클릭 → 화면 반영',
  legends: [
    { kind: 'input', label: '클릭 처리' },
    { kind: 'render', label: 'UI 갱신' },
    { kind: 'network', label: 'Server Action' },
    { kind: 'cache', label: '서버 상태 확정' },
    { kind: 'idle', label: '스피너 대기' }
  ],
  before: {
    variant: 'before',
    title: '전통적 요청 — 응답을 봐야 그린다',
    statusLabel: '응답 대기',
    summary:
      '클릭하면 스피너를 띄우고 서버 응답을 기다린다. 네트워크가 왕복하는 400ms 동안 화면은 아무 변화가 없어 눌린 것인지조차 불확실하다.',
    tasks: [
      {
        id: 'b-click',
        label: '클릭 처리',
        startMs: 40,
        durationMs: 10,
        kind: 'input',
        detail: '좋아요 버튼의 클릭 핸들러가 요청을 만든다.'
      },
      {
        id: 'b-wait',
        label: '스피너 대기',
        startMs: 50,
        durationMs: 370,
        kind: 'idle',
        detail: '서버 왕복이 끝날 때까지 로딩 스피너만 돈다. 좋아요 수는 그대로다.'
      },
      {
        id: 'b-apply',
        label: '응답 반영',
        startMs: 420,
        durationMs: 40,
        kind: 'render',
        detail: '응답이 도착한 뒤에야 좋아요 수가 +1 된다.'
      }
    ],
    events: [
      {
        id: 'b-like',
        label: '좋아요',
        kind: 'input',
        arriveMs: 40,
        handledMs: 460,
        detail: '클릭부터 화면 반영까지 420ms'
      }
    ],
    completeMs: 460,
    metricMs: 420
  },
  after: {
    variant: 'after',
    title: 'useOptimistic — 화면부터 먼저',
    statusLabel: '즉시 반영',
    summary:
      '성공을 가정하고 화면을 먼저 갱신한 뒤, 실제 저장은 Server Action이 백그라운드에서 처리한다. 실패하면 자동으로 이전 상태로 되돌아간다.',
    tasks: [
      {
        id: 'a-click',
        label: '클릭 처리',
        startMs: 40,
        durationMs: 6,
        kind: 'input',
        detail: '클릭 핸들러가 낙관적 상태를 즉시 갱신한다.'
      },
      {
        id: 'a-optimistic',
        label: '낙관적 렌더',
        startMs: 46,
        durationMs: 14,
        kind: 'render',
        detail: '네트워크를 기다리지 않고 같은 프레임에 좋아요 수가 +1 된다.'
      },
      {
        id: 'a-action',
        label: 'Server Action',
        startMs: 60,
        durationMs: 380,
        kind: 'network',
        detail: '실제 DB 저장은 백그라운드에서 진행된다. 사용자는 이 시간을 체감하지 않는다.'
      },
      {
        id: 'a-settle',
        label: '확정 반영',
        startMs: 440,
        durationMs: 30,
        kind: 'cache',
        detail: '서버가 확정한 값으로 조용히 교체된다. 실패했다면 여기서 롤백된다.'
      }
    ],
    yieldPointsMs: [46],
    events: [
      {
        id: 'a-like',
        label: '좋아요',
        kind: 'input',
        arriveMs: 40,
        handledMs: 40,
        detail: '클릭과 동시에 화면이 갱신된다'
      }
    ],
    completeMs: 60,
    metricMs: 0
  }
};

export const OptimisticUiTimelineDemo: React.FC = () => <TimelineCompareCanvas spec={spec} />;
