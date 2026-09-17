/**
 * @fileoverview timeline/layout.ts
 * 캔버스 세로 배치를 폭·밀도로부터 계산한다. 하드코딩된 y 상수는 두지 않으며,
 * 총 높이도 이 계산의 결과다 (프롭으로 받지 않는다).
 */

import type {
  Density,
  EventRowMap,
  HoverTarget,
  LaneLayout,
  TimeScale,
  TimelineCompareSpec,
  TimelineLaneSpec,
  TimelineLayout
} from './types';

const PAD = { top: 12, right: 18, bottom: 12, left: 18 };
const AXIS_H = 24;
const HEADER_H = 18;
const LANE_GAP = 12;
const SUMMARY_H = 42;

function barHeight(density: Density): number {
  return density === 'compact' ? 38 : 44;
}

function flowHeight(density: Density): number {
  return density === 'compact' ? 30 : 38;
}

/** 태스크 바 위쪽에 비워 두는 스케줄 아크 전용 띠 높이 */
export const ARC_BAND = 11;

/** 실제 태스크 사각형이 놓이는 세로 범위 (아크 띠를 제외한 나머지) */
export function taskBandOf(laneLayout: LaneLayout): { y: number; height: number } {
  return { y: laneLayout.bar.y + ARC_BAND, height: laneLayout.bar.height - ARC_BAND - 5 };
}

/** 이벤트 지연 막대가 놓이는 행 높이 */
export function eventRowHeight(density: Density): number {
  return density === 'compact' ? 13 : 15;
}

export interface LayoutOptions {
  width: number;
  density: Density;
  laneCount: number;
  minHeight: number;
}

export function computeLayout({ width, density, laneCount, minHeight }: LayoutOptions): TimelineLayout {
  const plotX = PAD.left;
  const plotWidth = Math.max(80, width - PAD.left - PAD.right);
  const bar = barHeight(density);
  const flow = flowHeight(density);
  const laneBlock = HEADER_H + bar + flow;

  const axis = { x: plotX, y: PAD.top, width: plotWidth, height: AXIS_H };
  const lanes: LaneLayout[] = [];
  let cursor = axis.y + AXIS_H;

  for (let i = 0; i < laneCount; i++) {
    lanes.push({
      header: { x: plotX, y: cursor, width: plotWidth, height: HEADER_H },
      bar: { x: plotX, y: cursor + HEADER_H, width: plotWidth, height: bar },
      flow: { x: plotX, y: cursor + HEADER_H + bar, width: plotWidth, height: flow }
    });
    cursor += laneBlock + (i < laneCount - 1 ? LANE_GAP : 0);
  }

  const contentBottom = cursor;
  const naturalHeight = contentBottom + SUMMARY_H + PAD.bottom;
  const height = Math.max(naturalHeight, minHeight);

  return {
    width,
    height,
    density,
    plotX,
    plotWidth,
    axis,
    guide: { top: axis.y + AXIS_H - 4, bottom: contentBottom },
    lanes,
    summary: {
      x: plotX,
      y: contentBottom,
      width: plotWidth,
      height: height - contentBottom - PAD.bottom
    }
  };
}

/**
 * 이벤트 지연 막대가 서로 겹치지 않도록 행을 배정한다.
 * 시간 순 그리디 인터벌 패킹 — 결과는 스펙에만 의존하므로 프레임마다 같다.
 */
export function assignEventRows(lane: TimelineLaneSpec, maxRows: number): EventRowMap {
  const rows: number[] = [];
  const map: EventRowMap = {};
  const sorted = [...lane.events].sort((a, b) => a.arriveMs - b.arriveMs);

  for (const event of sorted) {
    let row = rows.findIndex((endMs) => endMs <= event.arriveMs);
    if (row === -1) {
      row = rows.length < maxRows ? rows.length : rows.indexOf(Math.min(...rows));
      if (rows.length < maxRows) rows.push(0);
    }
    rows[row] = Math.max(rows[row], event.handledMs);
    map[event.id] = row;
  }
  return map;
}

export function maxEventRows(density: Density): number {
  return density === 'compact' ? 2 : 3;
}

/** 태스크 바 위 포인터가 어떤 블록 위에 있는지 판정한다 */
export function hitTestTask(
  layout: TimelineLayout,
  scale: TimeScale,
  spec: TimelineCompareSpec,
  pointer: { x: number; y: number; isInside: boolean }
): HoverTarget | null {
  if (!pointer.isInside) return null;
  const lanes = [spec.before, spec.after];

  for (let i = 0; i < layout.lanes.length; i++) {
    const { bar } = layout.lanes[i];
    if (pointer.y < bar.y || pointer.y > bar.y + bar.height) continue;

    const ms = scale.xToMs(pointer.x);
    for (const task of lanes[i].tasks) {
      const x0 = scale.msToX(task.startMs);
      const x1 = Math.max(x0 + 3, scale.msToX(task.startMs + task.durationMs));
      if (pointer.x >= x0 && pointer.x <= x1 && ms >= 0) {
        return { laneIndex: i, taskId: task.id };
      }
    }
  }
  return null;
}
