/**
 * @fileoverview structure/strategy-hit.ts
 * 단계 블록 위 포인터 판정. 레인 배치 계산은 strategy-lanes.ts와 같은 상수를 공유한다.
 */

import { AREAS, GUTTER_W, AXIS_H, LANE_HEADER_H, LANE_ROW_H, laneTop } from './strategy-lanes';
import type { Panel, RenderMode, StrategyLaneSpec } from './types';

/** 단계 블록 위 포인터 판정 */
export function hitTestSteps(
  panel: Panel,
  lanes: StrategyLaneSpec[],
  mode: RenderMode,
  totalMs: number,
  pointer: { x: number; y: number; isInside: boolean }
): string | null {
  if (!pointer.isInside) return null;
  const plotX = panel.x + GUTTER_W;
  const plotW = Math.max(80, panel.width - GUTTER_W);
  const toX = (ms: number) => plotX + (Math.max(0, Math.min(totalMs, ms)) / totalMs) * plotW;
  const top = panel.y + AXIS_H;

  for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
    const y = laneTop(laneIndex, top);
    for (const step of lanes[laneIndex].steps[mode]) {
      const areaIndex = AREAS.indexOf(step.area);
      const rowY = y + LANE_HEADER_H + areaIndex * LANE_ROW_H;
      const x0 = toX(step.startMs);
      const width = Math.max(4, toX(step.startMs + step.durationMs) - x0);
      if (
        pointer.x >= x0 &&
        pointer.x <= x0 + width &&
        pointer.y >= rowY &&
        pointer.y <= rowY + LANE_ROW_H - 2
      ) {
        return step.id;
      }
    }
  }
  return null;
}
