/**
 * @fileoverview cache-components/paint-mall-nodes.ts
 * 요청 추적도의 고정 노드 — 브라우저(왼쪽), 원본 서버(오른쪽), 레인 가운데의 캐시 항목 노드.
 * 캐시 노드는 "무엇을 들고 있고(v1/v2) 지금 어느 구간인지(FRESH/STALE/EXPIRED)"를 한눈에 보여 준다.
 */

import { drawRoundRect, drawCircle } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { clamp } from '../../core/math';
import { shelfAgeSec, type CacheEntryState, type LaneKey } from './mall-model';
import { MALL_COLOR, MALL_TIMING, ZONE_BADGE, ZONE_COLOR, laneZone, pop } from './paint-mall-helpers';
import type { Box, LaneGeometry, MallPaintOptions } from './paint-mall-types';

export function drawPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  centerY: number,
  text: string,
  color: string,
  opts: { filled?: boolean; alpha?: number; align?: 'left' | 'right' | 'center' } = {}
): number {
  ctx.save();
  // 바깥에서 레인을 흐리게 만든 알파(호버 강조)를 덮어쓰지 않고 곱한다
  ctx.globalAlpha = ctx.globalAlpha * (opts.alpha ?? 1);
  ctx.font = `700 9px ${DEFAULT_FONT_FAMILY}`;
  const w = ctx.measureText(text).width + 14;
  const left = opts.align === 'right' ? x - w : opts.align === 'center' ? x - w / 2 : x;
  drawRoundRect(ctx, {
    x: left,
    y: centerY - 9,
    width: w,
    height: 18,
    radius: 9,
    fill: opts.filled ? color : `${color}14`,
    stroke: color,
    lineWidth: 1
  });
  drawText(ctx, text, {
    x: left + w / 2,
    y: centerY,
    align: 'center',
    baseline: 'middle',
    fontSize: 9,
    fontWeight: 700,
    color: opts.filled ? '#ffffff' : color
  });
  ctx.restore();
  return w;
}

/** 왼쪽 세로 노드 — 페이지를 요청하는 브라우저 */
export function drawBrowserNode(ctx: CanvasRenderingContext2D, box: Box, o: MallPaintOptions): void {
  const active = o.travels.length > 0;
  drawRoundRect(ctx, {
    ...box,
    radius: 10,
    fill: active ? `${MALL_COLOR.browser}0d` : MALL_COLOR.lane,
    stroke: active ? MALL_COLOR.browser : MALL_COLOR.panelBorder,
    lineWidth: active ? 1.6 : 1
  });
  const cx = box.x + box.width / 2;
  drawText(ctx, '브라우저', { x: cx, y: box.y + 22, align: 'center', baseline: 'middle', fontSize: 11, fontWeight: 800, color: MALL_COLOR.browser });
  drawText(ctx, 'GET /', { x: cx, y: box.y + 38, align: 'center', baseline: 'middle', fontSize: 9, fontWeight: 600, color: MALL_COLOR.sub });
  drawText(ctx, `요청 ${o.sim.requestCount}회`, {
    x: cx,
    y: box.y + box.height - 16,
    align: 'center',
    baseline: 'middle',
    fontSize: 9,
    fontWeight: 600,
    color: MALL_COLOR.faint
  });
}

/** 오른쪽 세로 노드 — 원본 서버(DB). 재생성 중이면 어떤 항목을 만드는지 표시 */
export function drawServerNode(ctx: CanvasRenderingContext2D, box: Box, o: MallPaintOptions): void {
  const busy: string[] = [];
  if (o.sim.shelf.regenUntilSec !== null) busy.push('진열대');
  if (o.sim.product.regenUntilSec !== null) busy.push('상품 상세');
  const anyBlocking = o.sim.shelf.regenMode === 'blocking' || o.sim.product.regenMode === 'blocking';
  const admin = o.adminPulse && o.timeMs - o.adminPulse.startMs < MALL_TIMING.adminPulseMs;
  const accent = admin ? MALL_COLOR.admin : busy.length ? (anyBlocking ? MALL_COLOR.expired : MALL_COLOR.regen) : MALL_COLOR.server;
  drawRoundRect(ctx, {
    ...box,
    radius: 10,
    fill: busy.length || admin ? `${accent}0d` : MALL_COLOR.lane,
    stroke: busy.length || admin ? accent : MALL_COLOR.panelBorder,
    lineWidth: busy.length || admin ? 1.6 : 1
  });
  const cx = box.x + box.width / 2;
  drawText(ctx, '원본 서버', { x: cx, y: box.y + 22, align: 'center', baseline: 'middle', fontSize: 11, fontWeight: 800, color: accent });
  drawText(ctx, 'DB · 렌더링', { x: cx, y: box.y + 38, align: 'center', baseline: 'middle', fontSize: 9, fontWeight: 600, color: MALL_COLOR.sub });

  const statusY = box.y + box.height - 18;
  if (admin) {
    drawText(ctx, 'Server Action', { x: cx, y: statusY - 12, align: 'center', baseline: 'middle', fontSize: 8, fontWeight: 700, color: MALL_COLOR.admin });
    drawText(ctx, `${o.adminPulse!.mode}()`, { x: cx, y: statusY, align: 'center', baseline: 'middle', fontSize: 9, fontWeight: 700, color: MALL_COLOR.admin });
  } else if (busy.length) {
    const spin = (o.timeMs / 600) % 1;
    drawCircle(ctx, { x: cx, y: statusY - 14, radius: 4, stroke: `${accent}55`, lineWidth: 2 });
    ctx.save();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, statusY - 14, 4, spin * Math.PI * 2, spin * Math.PI * 2 + Math.PI * 0.9);
    ctx.stroke();
    ctx.restore();
    drawText(ctx, `${busy.join('·')} 재생성 중`, { x: cx, y: statusY, align: 'center', baseline: 'middle', fontSize: 8, fontWeight: 700, color: accent });
  } else {
    drawText(ctx, '대기', { x: cx, y: statusY, align: 'center', baseline: 'middle', fontSize: 9, fontWeight: 600, color: MALL_COLOR.faint });
  }
}

/** 레인 가운데의 캐시 항목 노드 — 버전·상태 배지, 진열대는 나이 막대까지 */
export function drawCacheNode(ctx: CanvasRenderingContext2D, g: LaneGeometry, o: MallPaintOptions, dim: boolean): void {
  const box = g.cacheBox!;
  const entry: CacheEntryState = g.key === 'shelf' ? o.sim.shelf : o.sim.product;
  const zone = laneZone(o.sim, g.key)!;
  const regenerating = entry.regenUntilSec !== null;
  const color = !regenerating ? ZONE_COLOR[zone] : entry.regenMode === 'blocking' ? MALL_COLOR.expired : MALL_COLOR.regen;
  const flash = o.flashes.find((f) => f.lane === g.key);
  const flashT = flash ? 1 - pop(o.timeMs, flash.startMs, MALL_TIMING.flashMs) : 0;

  ctx.save();
  ctx.globalAlpha = dim ? 0.35 : 1;
  if (flashT > 0) {
    drawRoundRect(ctx, { x: box.x - 4, y: box.y - 4, width: box.width + 8, height: box.height + 8, radius: 12, stroke: MALL_COLOR.hit, lineWidth: 1 + flashT * 5, globalAlpha: flashT });
  }
  drawRoundRect(ctx, { ...box, radius: 8, fill: `${color}0f`, stroke: color, lineWidth: 1.4 });

  const badge = regenerating ? '재생성 중' : ZONE_BADGE[zone];
  drawText(ctx, `캐시 항목 · v${entry.version}`, { x: box.x + 10, y: box.y + 13, baseline: 'middle', fontSize: 10, fontWeight: 800, color: MALL_COLOR.ink });
  drawPill(ctx, box.x + box.width - 8, box.y + 13, badge, color, { filled: true, align: 'right' });

  if (g.key === 'shelf') drawAgeBar(ctx, box, o);
  else {
    const label = entry.forced === 'expired' ? '즉시 만료됨 → 다음 요청은 기다린다' : entry.forced === 'stale' ? 'STALE 표시 → 다음 요청이 갱신 트리거' : 'default 수명 · 태그로만 갱신';
    drawText(ctx, label, { x: box.x + 10, y: box.y + box.height - 12, baseline: 'middle', fontSize: 8.5, fontWeight: 600, color: entry.forced === 'none' ? MALL_COLOR.faint : color });
  }
  ctx.restore();
}

function drawAgeBar(ctx: CanvasRenderingContext2D, box: Box, o: MallPaintOptions): void {
  const { revalidate, expire } = o.sim.shelfLife;
  const span = expire ?? revalidate * 1.6;
  const age = shelfAgeSec(o.sim);
  const x = box.x + 10;
  const w = box.width - 20;
  const y = box.y + box.height - 15;
  const ratio = clamp(age / span, 0, 1);
  const zone = laneZone(o.sim, 'shelf')!;

  drawRoundRect(ctx, { x, y, width: w, height: 5, radius: 2.5, fill: MALL_COLOR.panelBorder });
  drawRoundRect(ctx, { x, y, width: Math.max(2, w * ratio), height: 5, radius: 2.5, fill: ZONE_COLOR[zone] });

  const mark = (sec: number, label: string, color: string) => {
    const mx = x + w * clamp(sec / span, 0, 1);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(mx, y - 3);
    ctx.lineTo(mx, y + 8);
    ctx.stroke();
    ctx.restore();
    drawText(ctx, label, { x: mx, y: y - 8, align: 'center', baseline: 'middle', fontSize: 7.5, fontWeight: 700, color });
  };
  mark(revalidate, `revalidate ${revalidate}s`, MALL_COLOR.stale);
  if (expire !== null) mark(expire, `expire ${expire}s`, MALL_COLOR.expired);
  else drawText(ctx, 'expire 없음', { x: x + w, y: y - 8, align: 'right', baseline: 'middle', fontSize: 7.5, fontWeight: 700, color: MALL_COLOR.faint });

  drawText(ctx, `나이 ${age.toFixed(1)}s`, { x, y: y - 8, baseline: 'middle', fontSize: 7.5, fontWeight: 700, color: MALL_COLOR.sub });
}

export const LANE_TITLE: Record<LaneKey, { name: string; code: string }> = {
  shelf: { name: '베스트셀러 진열대', code: "'use cache' + " },
  product: { name: '상품 상세 · 재고', code: "'use cache' + cacheTag('product:1')" },
  cart: { name: '장바구니 · 추천', code: 'cookies() — use cache 불가' }
};
