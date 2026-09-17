/**
 * @fileoverview structure/isr-track.ts
 * 캐시 나이 트랙 — 눈금, 재생성 음영 밴드, 나이 곡선, x축.
 * 재생성 밴드는 끝난 뒤에도 남겨 두어 지나간 사건을 되짚을 수 있게 한다.
 * 요청 마커와 인과 화살표는 isr-requests.ts가 그 위에 얹는다.
 */

import { drawRoundRect, drawCircle } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { STRUCTURE_UI, drawPanel } from './frame';
import type { IsrRuntime, IsrSpec, Panel } from './types';

export const HIT_COLOR = '#22c55e';
export const STALE_COLOR = '#f97316';
export const REGEN_COLOR = '#8b5cf6';

export interface Plot {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function plotOf(panel: Panel): Plot {
  return {
    x: panel.x + 36,
    y: panel.y + 30,
    w: Math.max(60, panel.width - 36 - 14),
    h: Math.max(50, panel.height - 30 - 24)
  };
}

export interface CacheTrackOptions {
  panel: Panel;
  spec: IsrSpec;
  runtime: IsrRuntime;
}

export function paintCacheTrack(
  ctx: CanvasRenderingContext2D,
  { panel, spec, runtime }: CacheTrackOptions
): void {
  const plot = plotOf(panel);
  const from = runtime.nowSec - spec.windowSec;
  const xOf = (t: number) => plot.x + ((t - from) / spec.windowSec) * plot.w;
  const yOf = (age: number) => plot.y + plot.h * (1 - Math.max(0, Math.min(spec.maxAgeSec, age)) / spec.maxAgeSec);

  const status = runtime.isRegenerating
    ? '백그라운드 재생성 중'
    : runtime.ageSec >= spec.revalidateSec
      ? '만료됨 — 다음 요청이 재생성을 트리거'
      : '신선함';
  drawPanel(ctx, panel, `캐시 나이 · revalidate = ${spec.revalidateSec}s`, status);

  paintGrid(ctx, plot, spec, yOf);
  paintRegenBands(ctx, plot, runtime, xOf);
  paintAgeLine(ctx, plot, runtime, xOf, yOf, from);
  paintXAxis(ctx, plot, spec, xOf, from, runtime.nowSec);
}

function paintGrid(ctx: CanvasRenderingContext2D, plot: Plot, spec: IsrSpec, yOf: (age: number) => number): void {
  ctx.font = `500 9px ${DEFAULT_FONT_FAMILY}`;
  for (let age = 0; age <= spec.maxAgeSec; age += 5) {
    const y = yOf(age);
    const isThreshold = age === spec.revalidateSec;

    ctx.save();
    ctx.strokeStyle = isThreshold ? '#fca5a5' : STRUCTURE_UI.guide;
    ctx.lineWidth = isThreshold ? 1.4 : 1;
    if (isThreshold) ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(plot.x, y);
    ctx.lineTo(plot.x + plot.w, y);
    ctx.stroke();
    ctx.restore();

    drawText(ctx, `${age}s`, {
      x: plot.x - 5,
      y,
      align: 'right',
      baseline: 'middle',
      fontSize: 9,
      fontWeight: isThreshold ? 700 : 500,
      color: isThreshold ? '#ef4444' : STRUCTURE_UI.faint
    });
  }
}

function paintRegenBands(
  ctx: CanvasRenderingContext2D,
  plot: Plot,
  runtime: IsrRuntime,
  xOf: (t: number) => number
): void {
  for (const band of runtime.bands) {
    const x0 = Math.max(plot.x, xOf(band.startSec));
    const x1 = Math.min(plot.x + plot.w, xOf(band.endSec ?? runtime.nowSec));
    if (x1 <= plot.x || x0 >= plot.x + plot.w || x1 - x0 < 0.5) continue;

    drawRoundRect(ctx, {
      x: x0,
      y: plot.y,
      width: Math.max(1.5, x1 - x0),
      height: plot.h,
      radius: 2,
      fill: `${REGEN_COLOR}1f`
    });
    ctx.save();
    ctx.strokeStyle = `${REGEN_COLOR}88`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, plot.y);
    ctx.lineTo(x0, plot.y + plot.h);
    ctx.stroke();
    ctx.restore();

    // 밴드가 충분히 넓을 때만 라벨 — 좁으면 아예 그리지 않는다
    const label = band.endSec === null ? '재생성 중' : '재생성';
    ctx.font = `700 9px ${DEFAULT_FONT_FAMILY}`;
    if (x1 - x0 > ctx.measureText(label).width + 8) {
      drawText(ctx, label, {
        x: (x0 + x1) / 2,
        y: plot.y + 9,
        align: 'center',
        fontSize: 9,
        fontWeight: 700,
        color: REGEN_COLOR
      });
    }
  }
}

function paintAgeLine(
  ctx: CanvasRenderingContext2D,
  plot: Plot,
  runtime: IsrRuntime,
  xOf: (t: number) => number,
  yOf: (age: number) => number,
  from: number
): void {
  const points = runtime.history.filter((p) => p.t >= from);
  if (points.length === 0) return;

  ctx.save();
  ctx.beginPath();
  ctx.rect(plot.x, plot.y, plot.w, plot.h);
  ctx.clip();
  ctx.strokeStyle = runtime.ageSec >= 10 ? STALE_COLOR : HIT_COLOR;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = xOf(p.t);
    const y = yOf(p.age);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(xOf(runtime.nowSec), yOf(runtime.ageSec));
  ctx.stroke();
  ctx.restore();

  drawCircle(ctx, {
    x: xOf(runtime.nowSec),
    y: yOf(runtime.ageSec),
    radius: 3.2,
    fill: runtime.ageSec >= 10 ? STALE_COLOR : HIT_COLOR
  });
}

function paintXAxis(
  ctx: CanvasRenderingContext2D,
  plot: Plot,
  spec: IsrSpec,
  xOf: (t: number) => number,
  from: number,
  nowSec: number
): void {
  ctx.save();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(plot.x, plot.y + plot.h);
  ctx.lineTo(plot.x + plot.w, plot.y + plot.h);
  ctx.stroke();
  ctx.restore();

  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const t = from + (spec.windowSec / steps) * i;
    const offset = Math.round(t - nowSec);
    drawText(ctx, offset === 0 ? '지금' : `${offset}s`, {
      x: xOf(t),
      y: plot.y + plot.h + 12,
      align: i === 0 ? 'left' : i === steps ? 'right' : 'center',
      fontSize: 9,
      fontWeight: offset === 0 ? 700 : 500,
      color: offset === 0 ? '#334155' : STRUCTURE_UI.faint
    });
  }
}
