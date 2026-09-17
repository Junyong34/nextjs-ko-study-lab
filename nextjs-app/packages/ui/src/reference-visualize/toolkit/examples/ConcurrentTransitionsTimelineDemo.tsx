/**
 * @fileoverview ConcurrentTransitionsTimelineDemo
 * 동기 렌더(UI 프리징) vs startTransition 양보 렌더 — 입력이 언제 처리되는가
 */

'use client';

import React from 'react';
import { TimelineCompareCanvas } from '../components/TimelineCompareCanvas';
import type { TimelineCompareSpec } from '../components/timeline';

const spec: TimelineCompareSpec = {
  totalMs: 400,
  metricLabel: '최대 입력 지연',
  legends: [
    { kind: 'block', label: '동기 롱 태스크' },
    { kind: 'work', label: '리스트 청크' },
    { kind: 'input', label: '키 입력 처리' },
    { kind: 'render', label: '글자 렌더' }
  ],
  before: {
    variant: 'before',
    title: '동기 렌더 — 끝날 때까지 안 놓는다',
    statusLabel: '스레드 점유',
    summary:
      '10,000개 리스트를 한 태스크에서 만든다. 그 300ms 동안 메인 스레드는 잠겨 있고, 사이에 들어온 키 입력은 큐에서 순서를 기다린다.',
    tasks: [
      {
        id: 'b-render',
        label: '10,000개 동기 렌더',
        startMs: 0,
        durationMs: 300,
        kind: 'block',
        detail:
          '리스트 전체를 하나의 태스크에서 생성한다. 브라우저는 이 함수가 반환되기 전에는 어떤 이벤트도 처리할 수 없다.'
      },
      {
        id: 'b-input',
        label: '입력',
        startMs: 300,
        durationMs: 10,
        kind: 'input',
        detail: '태스크가 끝나고서야 밀려 있던 키 입력이 처리된다.'
      },
      {
        id: 'b-paint',
        label: '렌더',
        startMs: 310,
        durationMs: 30,
        kind: 'render',
        detail: '입력창에 글자가 뒤늦게 한꺼번에 나타난다.'
      }
    ],
    events: [
      {
        id: 'b-key',
        label: '키 입력',
        kind: 'input',
        arriveMs: 60,
        handledMs: 310,
        detail: '60ms에 누른 키가 250ms 뒤에야 화면에 반영된다'
      }
    ],
    completeMs: 310,
    metricMs: 250
  },
  after: {
    variant: 'after',
    title: 'startTransition — 틈마다 양보한다',
    statusLabel: '양보 렌더',
    summary:
      '같은 총량을 60~70ms 청크로 쪼개고, 청크 사이마다 제어권을 브라우저에 돌려준다. 그 틈에서 키 입력이 16ms 만에 처리된다.',
    tasks: [
      {
        id: 'a-c1',
        label: '청크 1',
        startMs: 0,
        durationMs: 60,
        kind: 'work',
        detail: '리스트의 첫 조각만 만들고 프레임 예산이 차기 전에 멈춘다.'
      },
      {
        id: 'a-in1',
        label: '입력',
        startMs: 60,
        durationMs: 16,
        kind: 'input',
        detail: '양보된 틈에서 키 입력이 곧바로 처리된다.'
      },
      {
        id: 'a-r1',
        label: '렌더',
        startMs: 76,
        durationMs: 14,
        kind: 'render',
        detail: '입력한 글자가 같은 프레임에 화면에 나타난다.'
      },
      {
        id: 'a-c2',
        label: '청크 2',
        startMs: 90,
        durationMs: 70,
        kind: 'work',
        detail: '남은 작업을 다음 태스크로 이어서 진행한다.'
      },
      {
        id: 'a-in2',
        label: '입력',
        startMs: 160,
        durationMs: 16,
        kind: 'input',
        detail: '두 번째 키 입력도 같은 방식으로 즉시 처리된다.'
      },
      {
        id: 'a-r2',
        label: '렌더',
        startMs: 176,
        durationMs: 14,
        kind: 'render',
        detail: '타이핑이 끊기지 않고 이어진다.'
      },
      {
        id: 'a-c3',
        label: '청크 3',
        startMs: 190,
        durationMs: 70,
        kind: 'work',
        detail: '급하지 않은 리스트 렌더는 낮은 우선순위로 계속된다.'
      },
      {
        id: 'a-c4',
        label: '청크 4',
        startMs: 260,
        durationMs: 70,
        kind: 'work',
        detail: '총 작업량은 같지만 사용자는 멈춤을 느끼지 않는다.'
      }
    ],
    yieldPointsMs: [60, 160],
    events: [
      {
        id: 'a-key1',
        label: '키 입력',
        kind: 'input',
        arriveMs: 60,
        handledMs: 76,
        detail: '한 프레임 안에서 처리된다'
      },
      {
        id: 'a-key2',
        label: '키 입력',
        kind: 'input',
        arriveMs: 160,
        handledMs: 176,
        detail: '연속 입력도 동일하게 16ms'
      }
    ],
    completeMs: 76,
    metricMs: 16
  }
};

export const ConcurrentTransitionsTimelineDemo: React.FC = () => <TimelineCompareCanvas spec={spec} />;
