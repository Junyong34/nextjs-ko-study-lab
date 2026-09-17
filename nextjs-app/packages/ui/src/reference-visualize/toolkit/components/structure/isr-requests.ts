/**
 * @fileoverview structure/isr-requests.ts
 * 요청 마커와 인과 화살표.
 * stale-while-revalidate의 핵심은 "만료 뒤 첫 요청이 구버전을 받으면서
 * **바로 그 요청이** 재생성을 트리거한다"이므로, STALE 마커에서 재생성 밴드 시작으로 화살표를 잇는다.
 */

import { drawCircle } from '../../primitives/shapes';
import { drawLineArrowHead } from '../timeline/arrow-head';
import { HIT_COLOR, REGEN_COLOR, STALE_COLOR, plotOf, type Plot } from './isr-track';
import type { IsrRuntime, IsrSpec, Panel } from './types';

export interface RequestMarkerOptions {
  panel: Panel;
  spec: IsrSpec;
  runtime: IsrRuntime;
  hoveredId: string | null;
}

export function paintRequestMarkers(
  ctx: CanvasRenderingContext2D,
  { panel, spec, runtime, hoveredId }: RequestMarkerOptions
): void {
  const plot = plotOf(panel);
  const from = runtime.nowSec - spec.windowSec;
  const xOf = (t: number) => plot.x + ((t - from) / spec.windowSec) * plot.w;
  const yOf = (age: number) =>
    plot.y + plot.h * (1 - Math.max(0, Math.min(spec.maxAgeSec, age)) / spec.maxAgeSec);

  paintRequests(ctx, plot, runtime, xOf, yOf, from, hoveredId);
}

function paintRequests(
  ctx: CanvasRenderingContext2D,
  plot: Plot,
  runtime: IsrRuntime,
  xOf: (t: number) => number,
  yOf: (age: number) => number,
  from: number,
  hoveredId: string | null
): void {
  for (const req of runtime.requests) {
    if (req.atSec < from) continue;
    const x = xOf(req.atSec);
    const y = yOf(req.ageSec);
    const color = req.result === 'HIT' ? HIT_COLOR : STALE_COLOR;
    const isHovered = hoveredId === `req-${req.id}`;

    ctx.save();
    ctx.strokeStyle = `${color}66`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, plot.y + plot.h);
    ctx.stroke();
    ctx.restore();

    drawCircle(ctx, {
      x,
      y,
      radius: isHovered ? 5 : 3.6,
      fill: '#ffffff',
      stroke: color,
      lineWidth: isHovered ? 2.4 : 1.8
    });

    // 이 요청이 재생성을 유발했다면 밴드 시작으로 화살표를 잇는다
    if (!req.triggeredRegen) continue;
    const band = runtime.bands.find((b) => b.triggeredBy === req.id);
    if (!band) continue;
    const bx = xOf(band.startSec);
    const by = plot.y + 16;

    ctx.save();
    ctx.strokeStyle = REGEN_COLOR;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, y - 6);
    ctx.quadraticCurveTo((x + bx) / 2, by - 12, bx, by);
    ctx.stroke();
    ctx.restore();
    drawLineArrowHead(ctx, bx, by, Math.atan2(by - (by - 12), bx - (x + bx) / 2), REGEN_COLOR, 3.6, 1.1);
  }
}

/** 트랙 위 포인터에 가장 가까운 요청 마커 */
export function hitTestRequests(
  panel: Panel,
  spec: IsrSpec,
  runtime: IsrRuntime,
  pointer: { x: number; y: number; isInside: boolean }
): string | null {
  if (!pointer.isInside) return null;
  const plot = plotOf(panel);
  if (pointer.y < plot.y || pointer.y > plot.y + plot.h) return null;
  const from = runtime.nowSec - spec.windowSec;
  const xOf = (t: number) => plot.x + ((t - from) / spec.windowSec) * plot.w;

  let best: { id: string; dist: number } | null = null;
  for (const req of runtime.requests) {
    if (req.atSec < from) continue;
    const dist = Math.abs(xOf(req.atSec) - pointer.x);
    if (dist < 8 && (!best || dist < best.dist)) best = { id: `req-${req.id}`, dist };
  }
  return best?.id ?? null;
}
