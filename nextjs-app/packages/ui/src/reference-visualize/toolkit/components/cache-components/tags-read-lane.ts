/**
 * @fileoverview cache-components/tags-read-lane.ts
 * 두 갈래 안의 **읽기 레인** — 요청이 캐시 항목에 닿아 응답을 받는 구간.
 *
 * 이 데모에서 두 API의 차이가 실제로 드러나는 곳이므로, 출발(`요청`)·도착(`캐시 항목`)·
 * 결과(`응답`)에 모두 이름을 붙인다. 이름 없는 점선은 방향도 의미도 전하지 못한다.
 */

import { drawRoundRect, drawCircle } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { drawLineArrowHead } from '../timeline/arrow-head';
import { STRUCTURE_UI } from '../structure/frame';
import { C } from './paint';

export const ease = (t: number) => t * t * (3 - 2 * t);

export interface Branch {
  api: string;
  where: string;
  color: string;
  /** 단계별 캐시 항목 상태 [배지, 부연] */
  states: [string, string][];
  /** 단계별 응답 칩 */
  reads: string[];
  /** 이 갈래가 백그라운드 재생성을 돌리는가 */
  background: boolean;
}

/** 출발·도착·결과에 모두 이름을 붙인다 */
export function paintReadLane(
  ctx: CanvasRenderingContext2D, x: number, y: number, w: number,
  branch: Branch, stateColor: string, step: number, t: number
): void {
  const reading = step >= 2;
  const idle = step === 1;
  const x0 = x + 14;
  const rightEdge = x + w - 14;
  const readText = branch.reads[Math.min(step, 3)];

  // 요청 → 캐시 항목 → 응답이 레인 안에서 고르게 놓이게 한다.
  // 도착지를 오른쪽 끝에 몰아 두면 긴 점선만 남고 세 자리의 관계가 안 보인다.
  ctx.font = `700 10px ${DEFAULT_FONT_FAMILY}`;
  const laneW = rightEdge - x0;
  const cacheW = 78;
  const chipW = Math.min(150, Math.max(64, ctx.measureText(readText).width + 24));
  const dash = Math.max(40, Math.min(laneW * 0.4, laneW - cacheW - chipW - 24));
  const cacheX = x0 + dash;
  const chipX = cacheX + cacheW + 22;
  const dim = idle ? 0.35 : 1;

  drawText(ctx, '요청', {
    x: x0, y: y - 17, fontSize: 9, fontWeight: 700,
    color: reading ? branch.color : STRUCTURE_UI.faint
  });
  drawText(ctx, '응답', {
    x: chipX, y: y - 17, fontSize: 9, fontWeight: 700,
    color: reading ? branch.color : STRUCTURE_UI.faint
  });

  ctx.save();
  ctx.globalAlpha = dim;
  ctx.strokeStyle = reading ? `${branch.color}88` : STRUCTURE_UI.panelBorder;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(cacheX - 7, y);
  ctx.stroke();
  ctx.restore();
  // 출발점 — 점선만 두면 어디서 시작하는 선인지 알 수 없다
  drawCircle(ctx, {
    x: x0, y, radius: 3, fill: reading ? branch.color : STRUCTURE_UI.panelBorder
  });

  const travel = reading ? ease(Math.min(1, t / 0.55)) : 0;
  if (reading && travel < 1) {
    drawCircle(ctx, { x: x0 + (cacheX - 7 - x0) * travel, y, radius: 3.4, fill: branch.color });
  } else if (reading) {
    drawLineArrowHead(ctx, cacheX - 5, y, 0, branch.color, 4, 1.4);
  }

  // 도착지 — 무엇을 읽는지 이름으로 못박는다
  drawRoundRect(ctx, {
    x: cacheX, y: y - 12, width: cacheW, height: 24, radius: 6,
    fill: `${stateColor}14`, stroke: stateColor, lineWidth: 1.2
  });
  drawText(ctx, '캐시 항목', {
    x: cacheX + cacheW / 2, y, align: 'center', baseline: 'middle',
    fontSize: 9, fontWeight: 700, color: stateColor
  });

  paintResponse(ctx, cacheX + cacheW, chipX, y, chipW, readText, branch, reading, idle, t);
  if (branch.background && step >= 2) paintBackfill(ctx, chipX, y + 16, chipW, step, t);
}

function paintResponse(
  ctx: CanvasRenderingContext2D, fromX: number, chipX: number, y: number, chipW: number,
  text: string, branch: Branch, reading: boolean, idle: boolean, t: number
): void {
  const pop = reading ? ease(Math.max(0, Math.min(1, (t - 0.5) / 0.35))) : 1;

  ctx.save();
  ctx.globalAlpha = idle ? 0.35 : 1;
  ctx.strokeStyle = reading ? branch.color : STRUCTURE_UI.panelBorder;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(fromX + 5, y);
  ctx.lineTo(chipX - 5, y);
  ctx.stroke();
  ctx.restore();
  if (reading && pop > 0.1) drawLineArrowHead(ctx, chipX - 4, y, 0, branch.color, 4, 1.4);

  ctx.save();
  ctx.globalAlpha = idle ? 0.35 : reading ? 0.25 + pop * 0.75 : 1;
  drawRoundRect(ctx, {
    x: chipX, y: y - 11, width: chipW, height: 22, radius: 999,
    fill: reading ? branch.color : '#e2e8f0'
  });
  drawText(ctx, text, {
    x: chipX + chipW / 2, y, align: 'center', baseline: 'middle',
    fontSize: 10, fontWeight: 700, color: reading ? '#ffffff' : STRUCTURE_UI.sub
  });
  ctx.restore();
}

/** 사용자가 구값을 받는 그 시간 동안 뒤에서 도는 일 */
function paintBackfill(
  ctx: CanvasRenderingContext2D, x: number, y: number, w: number, step: number, t: number
): void {
  const done = step >= 3;
  const fill = done ? 1 : ease(t);
  drawRoundRect(ctx, { x, y, width: w, height: 5, radius: 999, fill: '#e2e8f0' });
  drawRoundRect(ctx, {
    x, y, width: Math.max(2, w * fill), height: 5, radius: 999, fill: C.amber
  });
  drawText(ctx, done ? '백그라운드 갱신 완료' : '백그라운드 갱신 중…', {
    x, y: y + 15, baseline: 'middle', fontSize: 9, fontWeight: 700, color: C.amber
  });
}
