/**
 * @fileoverview cache-components/paint-regions-page.ts
 * 브라우저 목업 — 사용자가 실제로 보는 페이지. 영역 4칸이 빈 화면 → 스켈레톤 → 콘텐츠로
 * 채워지는 순간을 보여 준다. 어떤 캐시 전략이든 결국 "언제 무엇이 화면에 나타나는가"로 끝난다.
 */

import { drawRoundRect, drawCircle } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { drawSkeletonLines } from '../structure/frame';
import { MODE_LABEL, REGION_BY_ID, firstPaintMs, regionFillMs, regionStateAt, type CacheFill, type RegionId, type RegionMode } from './regions-model';

export const MODE_COLOR: Record<RegionMode, string> = {
  static: '#2563eb',
  'cached-component': '#16a34a',
  'cached-function': '#7c3aed',
  dynamic: '#f97316'
};

export const REGIONS_UI = {
  ink: '#0f172a',
  sub: '#64748b',
  faint: '#94a3b8',
  panel: '#ffffff',
  border: '#e2e8f0',
  lane: '#f8fafc'
} as const;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PagePaintOptions {
  frame: Rect;
  /** 영역별 화면 칸 — paint-regions.ts의 레이아웃이 계산한다 */
  regionRects: Record<RegionId, Rect>;
  fill: CacheFill;
  nowMs: number;
  timeMs: number;
  hoveredId: RegionId | null;
}

export function paintPage(ctx: CanvasRenderingContext2D, o: PagePaintOptions): void {
  const { frame } = o;
  const painted = o.nowMs >= firstPaintMs(o.fill);

  drawRoundRect(ctx, { ...frame, radius: 9, fill: REGIONS_UI.panel, stroke: REGIONS_UI.border });
  const barH = 20;
  drawRoundRect(ctx, { x: frame.x + 8, y: frame.y + 8, width: frame.width - 16, height: barH, radius: 5, fill: '#f1f5f9', stroke: REGIONS_UI.border });
  ['#f87171', '#fbbf24', '#4ade80'].forEach((c, i) => drawCircle(ctx, { x: frame.x + 17 + i * 9, y: frame.y + 8 + barH / 2, radius: 2.6, fill: c }));
  drawText(ctx, 'studymall.app/', { x: frame.x + 48, y: frame.y + 8 + barH / 2, baseline: 'middle', fontSize: 9, fontWeight: 500, color: REGIONS_UI.sub });
  drawText(ctx, painted ? `첫 페인트 ${firstPaintMs(o.fill)}ms` : '빈 화면', {
    x: frame.x + frame.width - 12,
    y: frame.y + 8 + barH / 2,
    align: 'right',
    baseline: 'middle',
    fontSize: 8.5,
    fontWeight: 700,
    color: painted ? MODE_COLOR.static : REGIONS_UI.faint
  });

  if (!painted) {
    const cy = frame.y + frame.height / 2;
    drawText(ctx, '아직 첫 바이트가 오지 않았다', { x: frame.x + frame.width / 2, y: cy, align: 'center', baseline: 'middle', fontSize: 9.5, fontWeight: 600, color: REGIONS_UI.faint });
    if (o.fill === 'cold') {
      drawText(ctx, '상품 목록 캐시가 비어 셸을 못 보낸다', { x: frame.x + frame.width / 2, y: cy + 16, align: 'center', baseline: 'middle', fontSize: 8.5, fontWeight: 600, color: MODE_COLOR.dynamic });
    }
    return;
  }

  (Object.keys(o.regionRects) as RegionId[]).forEach((id) => paintRegionCell(ctx, id, o));
}

function paintRegionCell(ctx: CanvasRenderingContext2D, id: RegionId, o: PagePaintOptions): void {
  const rect = o.regionRects[id];
  const spec = REGION_BY_ID[id];
  const color = MODE_COLOR[spec.mode];
  const state = regionStateAt(id, o.fill, o.nowMs);
  const hovered = o.hoveredId === id;
  const dim = o.hoveredId !== null && !hovered;
  const sinceFill = o.nowMs - regionFillMs(id, o.fill);
  const flash = state === 'filled' && sinceFill < 220 ? 1 - sinceFill / 220 : 0;

  ctx.save();
  ctx.globalAlpha = dim ? 0.4 : 1;
  drawRoundRect(ctx, {
    ...rect,
    radius: 5,
    fill: state === 'filled' ? `${color}0d` : '#f8fafc',
    stroke: hovered ? color : state === 'filled' ? `${color}88` : REGIONS_UI.border,
    lineWidth: hovered ? 1.6 : 1 + flash * 2.5
  });

  const titleY = rect.y + 11;
  drawText(ctx, spec.title, { x: rect.x + 8, y: titleY, baseline: 'middle', fontSize: 8.5, fontWeight: 700, color: state === 'filled' ? REGIONS_UI.ink : REGIONS_UI.faint });
  // 모드 배지 — 글자 좌우 8px·상하 여유를 줘 답답하지 않게
  const badge = MODE_LABEL[spec.mode];
  ctx.font = `700 7.5px ${DEFAULT_FONT_FAMILY}`;
  const bw = ctx.measureText(badge).width + 16;
  const bh = 16;
  drawRoundRect(ctx, { x: rect.x + rect.width - bw - 6, y: titleY - bh / 2, width: bw, height: bh, radius: bh / 2, fill: state === 'filled' ? color : `${color}33` });
  drawText(ctx, badge, { x: rect.x + rect.width - 6 - bw / 2, y: titleY + 0.5, align: 'center', baseline: 'middle', fontSize: 7.5, fontWeight: 700, color: state === 'filled' ? '#ffffff' : color });

  const body: Rect = { x: rect.x + 8, y: rect.y + 22, width: rect.width - 16, height: rect.height - 28 };
  if (state === 'skeleton') {
    drawSkeletonLines(ctx, body, id === 'price' ? 1 : 2, o.timeMs);
    drawText(ctx, 'fallback', { x: body.x + body.width, y: body.y + body.height, align: 'right', baseline: 'bottom', fontSize: 7, fontWeight: 600, color: REGIONS_UI.faint });
  } else if (state === 'filled') {
    paintContent(ctx, id, body, color);
  }
  ctx.restore();
}

/** 영역별 미니 콘텐츠 — 도착했음을 "채워진 화면"으로 보여 준다 */
function paintContent(ctx: CanvasRenderingContext2D, id: RegionId, body: Rect, color: string): void {
  if (id === 'header') {
    drawRoundRect(ctx, { x: body.x, y: body.y, width: 34, height: Math.max(6, body.height), radius: 3, fill: color });
    for (let i = 0; i < 3; i += 1) {
      drawRoundRect(ctx, { x: body.x + 42 + i * 30, y: body.y + 1, width: 22, height: Math.max(4, body.height - 2), radius: 3, fill: `${color}33` });
    }
    return;
  }
  if (id === 'products') {
    const cards = 3;
    const gap = 6;
    const w = (body.width - gap * (cards - 1)) / cards;
    for (let i = 0; i < cards; i += 1) {
      const x = body.x + i * (w + gap);
      drawRoundRect(ctx, { x, y: body.y, width: w, height: body.height * 0.55, radius: 3, fill: `${color}2a` });
      drawRoundRect(ctx, { x, y: body.y + body.height * 0.62, width: w * 0.8, height: 4, radius: 2, fill: `${color}88` });
      drawRoundRect(ctx, { x, y: body.y + body.height * 0.62 + 7, width: w * 0.5, height: 4, radius: 2, fill: `${color}55` });
    }
    return;
  }
  if (id === 'price') {
    drawRoundRect(ctx, { x: body.x, y: body.y, width: body.width, height: body.height, radius: 4, fill: `${color}14` });
    drawText(ctx, '1 USD = 1,380 KRW', { x: body.x + 8, y: body.y + body.height / 2, baseline: 'middle', fontSize: 8.5, fontWeight: 800, color });
    drawText(ctx, '통화 KRW ← cookies()', { x: body.x + body.width - 8, y: body.y + body.height / 2, align: 'right', baseline: 'middle', fontSize: 7.5, fontWeight: 600, color: REGIONS_UI.sub });
    return;
  }
  const rows = 3;
  const rowH = body.height / rows;
  for (let i = 0; i < rows; i += 1) {
    const y = body.y + i * rowH + rowH / 2;
    drawCircle(ctx, { x: body.x + 6, y, radius: Math.min(5, rowH * 0.32), fill: `${color}66` });
    drawRoundRect(ctx, { x: body.x + 16, y: y - 2, width: body.width * (0.55 - i * 0.08), height: 4, radius: 2, fill: `${color}88` });
  }
}
