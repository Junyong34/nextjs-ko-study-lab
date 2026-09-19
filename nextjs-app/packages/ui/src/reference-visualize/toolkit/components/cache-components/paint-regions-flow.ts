/**
 * @fileoverview cache-components/paint-regions-flow.ts
 * 행(영역) 하나의 데이터 흐름 — 원천 노드 → 캐시 노드(또는 "캐시 없음") → 페이지 영역.
 * 어느 노드를 거치고 어느 노드를 건너뛰는지가 곧 그 영역의 캐시 전략이다.
 */

import { drawRoundRect, drawCircle } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { drawLineArrowHead } from '../timeline/arrow-head';
import { fitLabel } from '../timeline/label-fit';
import { clamp, lerp, easing } from '../../core/math';
import { MODE_COLOR, REGIONS_UI, type Rect } from './paint-regions-page';
import {
  REGION_BY_ID,
  activeStepAt,
  flowStepsFor,
  regionFillMs,
  type CacheFill,
  type FlowNode,
  type RegionId
} from './regions-model';

export interface RowGeometry {
  id: RegionId;
  /** 흐름 선의 y (페이지 영역 칸의 세로 중앙) */
  y: number;
  band: Rect;
  sourceBox: Rect;
  cacheBox: Rect;
  /** 페이지 목업의 왼쪽 가장자리 x */
  pageX: number;
}

export interface FlowPaintOptions {
  fill: CacheFill;
  nowMs: number;
  timeMs: number;
  hoveredId: RegionId | null;
}

export function paintRow(ctx: CanvasRenderingContext2D, g: RowGeometry, o: FlowPaintOptions): void {
  const spec = REGION_BY_ID[g.id];
  const color = MODE_COLOR[spec.mode];
  const hovered = o.hoveredId === g.id;
  const dim = o.hoveredId !== null && !hovered;
  const step = activeStepAt(g.id, o.fill, o.nowMs);
  const filled = o.nowMs >= regionFillMs(g.id, o.fill);

  ctx.save();
  ctx.globalAlpha = dim ? 0.35 : 1;
  if (hovered) drawRoundRect(ctx, { ...g.band, radius: 8, fill: `${color}08`, stroke: `${color}55` });

  paintConnectors(ctx, g, spec.cacheLabel !== null, step, filled, color);
  paintSourceNode(ctx, g, spec.source, step, color, o.fill);
  paintCacheNode(ctx, g, spec.cacheLabel, spec.cacheHint, spec.mode === 'static', o, color);
  if (step) paintDot(ctx, g, step.from, step.to, (o.nowMs - step.startMs) / (step.endMs - step.startMs), step.label, color);
  ctx.restore();
}

/** 상자 폭에 맞춰 글자 크기를 낮춰 그린다. 어떤 크기로도 안 들어가면 그리지 않는다 */
function fitText(ctx: CanvasRenderingContext2D, text: string, box: Rect, y: number, color: string, sizes: number[], weight: number): void {
  const fit = fitLabel(ctx, text, box.width - 12, 0, sizes);
  if (fit.mode !== 'full') return;
  drawText(ctx, fit.text, { x: box.x + box.width / 2, y, align: 'center', baseline: 'middle', fontSize: fit.fontSize, fontWeight: weight, color });
}

function nodeX(g: RowGeometry, node: FlowNode, side: 'out' | 'in'): number {
  if (node === 'source') return g.sourceBox.x + g.sourceBox.width;
  if (node === 'cache') return side === 'out' ? g.cacheBox.x + g.cacheBox.width : g.cacheBox.x;
  return g.pageX;
}

function paintConnectors(
  ctx: CanvasRenderingContext2D,
  g: RowGeometry,
  hasCache: boolean,
  step: ReturnType<typeof activeStepAt>,
  filled: boolean,
  color: string
): void {
  const y = g.y;
  const line = (x0: number, x1: number, active: boolean, dashed: boolean) => {
    ctx.save();
    ctx.strokeStyle = active ? color : REGIONS_UI.border;
    ctx.lineWidth = active ? 1.8 : 1.2;
    if (dashed) ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1 - 6, y);
    ctx.stroke();
    ctx.restore();
    drawLineArrowHead(ctx, x1 - 2, y, 0, active ? color : REGIONS_UI.faint, 4, 1.3);
  };
  const sx = g.sourceBox.x + g.sourceBox.width;
  if (hasCache) {
    const fetching = step?.from === 'source';
    line(sx, g.cacheBox.x, fetching, !fetching);
    line(g.cacheBox.x + g.cacheBox.width, g.pageX, step?.from === 'cache' || filled, false);
  } else {
    line(sx, g.pageX, step !== null || filled, false);
  }
}

function paintSourceNode(ctx: CanvasRenderingContext2D, g: RowGeometry, label: string | null, step: ReturnType<typeof activeStepAt>, color: string, fill: CacheFill): void {
  const box = g.sourceBox;
  if (!label) {
    drawText(ctx, '데이터 없음', { x: box.x + box.width / 2, y: g.y, align: 'center', baseline: 'middle', fontSize: 8.5, fontWeight: 600, color: REGIONS_UI.faint });
    return;
  }
  const active = step?.from === 'source';
  drawRoundRect(ctx, { ...box, radius: 7, fill: active ? `${color}12` : REGIONS_UI.lane, stroke: active ? color : REGIONS_UI.border, lineWidth: active ? 1.6 : 1 });
  const skipped = g.id === 'price' && fill === 'warm';
  fitText(ctx, label, box, g.y - (skipped ? 4 : 0), active ? color : REGIONS_UI.sub, [8.5, 8, 7.5], 700);
  if (skipped) fitText(ctx, '호출 안 함 (캐시 HIT)', box, g.y + 7, REGIONS_UI.faint, [7.5, 7], 600);
}

function paintCacheNode(ctx: CanvasRenderingContext2D, g: RowGeometry, label: string | null, hint: string | undefined, isShell: boolean, o: FlowPaintOptions, color: string): void {
  const box = g.cacheBox;
  if (!label) {
    ctx.save();
    ctx.setLineDash([4, 4]);
    drawRoundRect(ctx, { ...box, radius: 7, stroke: REGIONS_UI.border, lineWidth: 1.2 });
    ctx.restore();
    drawText(ctx, '캐시 없음', { x: box.x + box.width / 2, y: g.y - 4, align: 'center', baseline: 'middle', fontSize: 8.5, fontWeight: 700, color: MODE_COLOR.dynamic });
    drawText(ctx, '요청마다 새로 렌더', { x: box.x + box.width / 2, y: g.y + 7, align: 'center', baseline: 'middle', fontSize: 7.5, fontWeight: 600, color: REGIONS_UI.faint });
    return;
  }
  // 비어 있는 캐시: 원천에서 오는 단계가 끝나기 전까지 점선 상자
  const steps = flowStepsFor(g.id, o.fill);
  const fetch = steps.find((s) => s.from === 'source');
  const empty = !isShell && fetch !== undefined && o.nowMs < fetch.endMs;
  const justWritten = fetch !== undefined && o.nowMs >= fetch.endMs && o.nowMs - fetch.endMs < 220;
  const reading = o.nowMs >= regionFillMs(g.id, o.fill) || activeStepAt(g.id, o.fill, o.nowMs)?.from === 'cache';

  ctx.save();
  if (empty) ctx.setLineDash([4, 4]);
  drawRoundRect(ctx, {
    ...box,
    radius: 7,
    fill: empty ? 'transparent' : reading ? `${color}12` : REGIONS_UI.lane,
    stroke: empty ? REGIONS_UI.faint : color,
    lineWidth: justWritten ? 1 + (1 - (o.nowMs - fetch!.endMs) / 220) * 3 : reading ? 1.6 : 1.2
  });
  ctx.restore();
  fitText(ctx, label, box, g.y - 4, empty ? REGIONS_UI.faint : color, [8.5, 8, 7.5], 700);
  const status = empty ? '비어 있음 (MISS)' : isShell ? '요청 전에 이미 있음' : justWritten ? '방금 저장됨' : '저장돼 있음';
  fitText(ctx, hint ? `${status} · ${hint}` : status, box, g.y + 7, empty ? MODE_COLOR.dynamic : REGIONS_UI.faint, [7.5, 7], 600);
}

/** 이동 점 + 점을 따라다니는 단계 칩. 칩은 노드 위쪽 띠(y-22)에 두어 노드 글자와 겹치지 않는다 */
function paintDot(ctx: CanvasRenderingContext2D, g: RowGeometry, from: FlowNode, to: FlowNode, progress: number, label: string, color: string): void {
  const x0 = nodeX(g, from, 'out');
  const x1 = nodeX(g, to, 'in');
  const x = lerp(x0, x1 - 4, easing.easeInOutQuad(clamp(progress, 0, 1)));
  drawCircle(ctx, { x, y: g.y, radius: 5, fill: color, stroke: '#ffffff', lineWidth: 1.5 });

  ctx.font = `700 8px ${DEFAULT_FONT_FAMILY}`;
  const w = ctx.measureText(label).width + 14;
  const left = clamp(x - w / 2, g.sourceBox.x, g.pageX - w);
  const cy = g.y - 22;
  drawRoundRect(ctx, { x: left, y: cy - 8, width: w, height: 16, radius: 8, fill: color });
  drawText(ctx, label, { x: left + w / 2, y: cy, align: 'center', baseline: 'middle', fontSize: 8, fontWeight: 700, color: '#ffffff' });
}
