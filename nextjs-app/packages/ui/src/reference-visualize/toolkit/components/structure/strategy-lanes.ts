/**
 * @fileoverview structure/strategy-lanes.ts
 * 레인마다 서버 · 네트워크 · 클라이언트 세 줄을 두고, 각 단계를 자기 줄에만 그린다.
 * 블록의 **세로 위치와 색이 곧 "어디서 실행되는가"** 이므로, 실행 경계가 글로 설명하지 않아도 읽힌다.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { fitLabel } from '../timeline/label-fit';
import { formatMs } from '../timeline/scale';
import { STRUCTURE_UI } from './frame';
import { AREA_COLOR, AREA_LABEL } from './strategy-model';
import type { ExecArea, Panel, RenderMode, StrategyLaneSpec } from './types';

export const AREAS: ExecArea[] = ['server', 'network', 'client'];
export const LANE_HEADER_H = 15;
export const LANE_ROW_H = 14;
export const LANE_H = LANE_HEADER_H + LANE_ROW_H * AREAS.length;
export const LANE_GAP = 7;
export const GUTTER_W = 34;
export const AXIS_H = 18;

export function laneTop(index: number, top: number): number {
  return top + index * (LANE_H + LANE_GAP);
}

export function lanesHeight(count: number): number {
  return count * LANE_H + (count - 1) * LANE_GAP;
}

export interface LanePaintOptions {
  panel: Panel;
  lanes: StrategyLaneSpec[];
  mode: RenderMode;
  totalMs: number;
  nowMs: number;
  hoveredId: string | null;
}

export function paintStrategyLanes(
  ctx: CanvasRenderingContext2D,
  { panel, lanes, mode, totalMs, nowMs, hoveredId }: LanePaintOptions
): void {
  const plotX = panel.x + GUTTER_W;
  const plotW = Math.max(80, panel.width - GUTTER_W);
  const toX = (ms: number) => plotX + (Math.max(0, Math.min(totalMs, ms)) / totalMs) * plotW;
  const top = panel.y + AXIS_H;

  paintAxis(ctx, plotX, plotW, panel.y, top + lanesHeight(lanes.length), totalMs, toX);

  lanes.forEach((lane, laneIndex) => {
    const y = laneTop(laneIndex, top);
    paintLaneHeader(ctx, lane, mode, panel, y, toX);

    AREAS.forEach((area, areaIndex) => {
      const rowY = y + LANE_HEADER_H + areaIndex * LANE_ROW_H;

      drawRoundRect(ctx, {
        x: plotX,
        y: rowY,
        width: plotW,
        height: LANE_ROW_H - 2,
        radius: 3,
        fill: `${AREA_COLOR[area]}0a`
      });
      drawText(ctx, AREA_LABEL[area], {
        x: panel.x + GUTTER_W - 6,
        y: rowY + (LANE_ROW_H - 2) / 2,
        align: 'right',
        baseline: 'middle',
        fontSize: 8,
        fontWeight: 600,
        color: STRUCTURE_UI.faint
      });
    });

    lane.steps[mode].forEach((step, stepIndex) => {
      const areaIndex = AREAS.indexOf(step.area);
      const rowY = y + LANE_HEADER_H + areaIndex * LANE_ROW_H;
      const x0 = toX(step.startMs);
      const width = Math.max(4, toX(step.startMs + step.durationMs) - x0);
      const color = AREA_COLOR[step.area];
      const progress = Math.max(0, Math.min(1, (nowMs - step.startMs) / step.durationMs));
      const isHovered = hoveredId === step.id;

      drawRoundRect(ctx, {
        x: x0,
        y: rowY + 1,
        width,
        height: LANE_ROW_H - 4,
        radius: 3,
        fill: `${color}18`,
        stroke: `${color}55`,
        lineWidth: 1,
        lineDash: progress > 0 ? undefined : [3, 2]
      });
      if (progress > 0) {
        drawRoundRect(ctx, {
          x: x0,
          y: rowY + 1,
          width: Math.max(3, width * progress),
          height: LANE_ROW_H - 4,
          radius: 3,
          fill: color,
          globalAlpha: step.carriesHtml ? 1 : 0.85
        });
      }
      if (isHovered) {
        drawRoundRect(ctx, {
          x: x0 - 1,
          y: rowY,
          width: width + 2,
          height: LANE_ROW_H - 2,
          radius: 4,
          stroke: color,
          lineWidth: 2
        });
      }

      const fit = fitLabel(ctx, step.label, width - 6, stepIndex, [9, 8]);
      if (fit.mode === 'full') {
        drawText(ctx, fit.text, {
          x: x0 + width / 2,
          y: rowY + (LANE_ROW_H - 2) / 2,
          align: 'center',
          baseline: 'middle',
          fontSize: fit.fontSize,
          fontWeight: 700,
          color: progress > 0 ? '#ffffff' : color
        });
      }
    });

    paintFirstPaint(ctx, lane, mode, y, toX, nowMs);
  });
}

function paintLaneHeader(
  ctx: CanvasRenderingContext2D,
  lane: StrategyLaneSpec,
  mode: RenderMode,
  panel: Panel,
  y: number,
  toX: (ms: number) => number
): void {
  drawText(ctx, lane.title, {
    x: panel.x,
    y: y + LANE_HEADER_H / 2,
    baseline: 'middle',
    fontSize: 10,
    fontWeight: 700,
    color: lane.color
  });

  ctx.font = `700 10px ${DEFAULT_FONT_FAMILY}`;
  const titleRight = panel.x + ctx.measureText(lane.title).width;
  const text = `첫 화면 ${formatMs(lane.firstPaintMs[mode])} · ${lane.note}`;
  ctx.font = `600 9px ${DEFAULT_FONT_FAMILY}`;
  const right = panel.x + panel.width;
  if (right - ctx.measureText(text).width > titleRight + 12) {
    drawText(ctx, text, {
      x: right,
      y: y + LANE_HEADER_H / 2,
      align: 'right',
      baseline: 'middle',
      fontSize: 9,
      fontWeight: 600,
      color: STRUCTURE_UI.sub
    });
  }
  void toX;
}

function paintFirstPaint(
  ctx: CanvasRenderingContext2D,
  lane: StrategyLaneSpec,
  mode: RenderMode,
  y: number,
  toX: (ms: number) => number,
  nowMs: number
): void {
  const ms = lane.firstPaintMs[mode];
  if (nowMs < ms) return;
  const x = toX(ms);

  ctx.save();
  ctx.strokeStyle = lane.color;
  ctx.lineWidth = 1.6;
  ctx.setLineDash([3, 2]);
  ctx.beginPath();
  ctx.moveTo(x, y + LANE_HEADER_H);
  ctx.lineTo(x, y + LANE_H - 2);
  ctx.stroke();
  ctx.restore();
}

function paintAxis(
  ctx: CanvasRenderingContext2D,
  plotX: number,
  plotW: number,
  axisY: number,
  bottom: number,
  totalMs: number,
  toX: (ms: number) => number
): void {
  ctx.font = `500 9px ${DEFAULT_FONT_FAMILY}`;
  for (let i = 0; i <= 4; i++) {
    const ms = (totalMs / 4) * i;
    const x = toX(ms);
    ctx.strokeStyle = STRUCTURE_UI.guide;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, axisY + 12);
    ctx.lineTo(Math.round(x) + 0.5, bottom);
    ctx.stroke();
    drawText(ctx, formatMs(ms), {
      x,
      y: axisY + 6,
      align: i === 0 ? 'left' : i === 4 ? 'right' : 'center',
      fontSize: 9,
      fontWeight: 500,
      color: STRUCTURE_UI.faint
    });
  }
  void plotX;
  void plotW;
}
