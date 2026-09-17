/**
 * @fileoverview cache-components/paint-keys.ts
 * 핵심 그림: **경계선 + 키 조립 막대.**
 *
 * 위: `cookies()`는 캐시 경계 *밖*에서 읽어 인자로 넘긴다. 경계 안에서 읽으면
 * `next-request-in-use-cache`로 막힌다 (`03-api-reference/01-directives/use-cache.md:194`).
 * 아래: 키 조각 4개가 이어붙어 해시가 되고 캐시 테이블을 조회해 HIT/MISS가 갈린다 (`:74-99`).
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { drawLineArrowHead } from '../timeline/arrow-head';
import { STRUCTURE_UI } from '../structure/frame';
import { C, label } from './paint';
import type { CacheEntry, KeySegment, KeySegmentId } from './model';

export interface KeysPaintOptions {
  width: number;
  height: number;
  segments: KeySegment[];
  entries: CacheEntry[];
  hit: boolean;
  violation: boolean;
  /** 방금 바뀐 조각과 그 강조 세기(0~1) */
  flashId: KeySegmentId | null;
  flash: number;
}

export function paintKeys(ctx: CanvasRenderingContext2D, o: KeysPaintOptions): void {
  const pad = 12;
  const boundaryH = 124;
  // 경계선 라벨이 패널 위쪽에 붙으므로 그만큼 상단 여백을 둔다.
  // 여백 없이 pad에서 시작하면 라벨이 캔버스 밖으로 나가 잘린다.
  const top = pad + 12;
  paintBoundary(ctx, pad, top, o.width - pad * 2, boundaryH, o.violation);
  paintKeyBar(ctx, pad, top + boundaryH + 14, o.width - pad * 2, o);
  const tableY = top + boundaryH + 92;
  paintTable(ctx, pad, tableY, o.width - pad * 2, o.height - tableY - pad, o);
}

function paintBoundary(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, violation: boolean): void {
  const leftW = (w - 26) * 0.44;
  const rightX = x + leftW + 26;
  const rightW = w - leftW - 26;

  panel(ctx, x, y, leftW, h, '요청 범위', C.violet);
  panel(ctx, rightX, y, rightW, h, "'use cache' 범위", C.green);

  // 경계선
  const bx = x + leftW + 13;
  ctx.save();
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = violation ? '#dc2626' : C.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bx, y - 4);
  ctx.lineTo(bx, y + h + 4);
  ctx.stroke();
  ctx.restore();
  drawText(ctx, '캐시 경계', {
    x: bx,
    y: y - 9,
    align: 'center',
    fontSize: 9,
    fontWeight: 700,
    color: violation ? '#dc2626' : STRUCTURE_UI.faint
  });

  card(ctx, x + 10, y + 30, leftW - 20, 34, 'cookies()', "const locale = …get('locale')", C.violet);
  card(ctx, x + 10, y + 72, leftW - 20, 34, 'params', 'const { id } = await params', C.violet);

  card(ctx, rightX + 10, y + 30, rightW - 20, 34, "getProduct(id, locale) · 'use cache'", '인자로 받은 값만 쓴다', C.green);

  // 인자 전달 화살표
  const ay = y + 47;
  ctx.save();
  ctx.strokeStyle = C.green;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x + leftW - 8, ay);
  ctx.lineTo(rightX + 4, ay);
  ctx.stroke();
  ctx.restore();
  drawLineArrowHead(ctx, rightX + 8, ay, 0, C.green, 4, 1.5);
  drawText(ctx, '인자로 전달', {
    x: bx,
    y: ay - 8,
    align: 'center',
    fontSize: 9,
    fontWeight: 700,
    color: C.green
  });

  if (!violation) return;

  // 경계 안에서 요청 API를 읽으려 한 상태
  const vy = y + 74;
  drawRoundRect(ctx, {
    x: rightX + 10,
    y: vy,
    width: rightW - 20,
    height: 36,
    radius: 7,
    fill: '#fef2f2',
    stroke: '#dc2626',
    lineWidth: 1.6
  });
  label(ctx, '✕  cookies() — 경계 안에서 읽을 수 없다', rightX + 20, vy + 14, rightW - 40, '#b91c1c', 11);
  label(ctx, 'next-request-in-use-cache', rightX + 20, vy + 28, rightW - 40, '#dc2626', 9);
}

function paintKeyBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, o: KeysPaintOptions): void {
  drawText(ctx, '캐시 키 = 아래 조각을 직렬화한 것', {
    x,
    y: y + 6,
    fontSize: 10,
    fontWeight: 700,
    color: STRUCTURE_UI.sub
  });

  const n = o.segments.length;
  const hashW = 74;
  const gapW = 14;
  const chipW = (w - hashW - gapW * n) / n;
  let cx = x;

  o.segments.forEach((segment, index) => {
    const lit = o.flashId === segment.id ? o.flash : 0;
    drawRoundRect(ctx, {
      x: cx,
      y: y + 16,
      width: chipW,
      height: 40,
      radius: 7,
      fill: lit > 0 ? '#fff7ed' : '#f8fafc',
      stroke: lit > 0 ? '#f97316' : STRUCTURE_UI.panelBorder,
      lineWidth: lit > 0 ? 1.4 + lit : 1
    });
    label(ctx, segment.label, cx + 8, y + 29, chipW - 16, lit > 0 ? '#c2410c' : STRUCTURE_UI.sub, 9);
    label(ctx, segment.value, cx + 8, y + 45, chipW - 16, C.ink, 11);
    cx += chipW;
    if (index < n - 1) {
      drawText(ctx, '+', { x: cx + gapW / 2, y: y + 38, align: 'center', fontSize: 12, fontWeight: 700, color: STRUCTURE_UI.faint });
      cx += gapW;
    }
  });

  drawText(ctx, '=', { x: cx + gapW / 2, y: y + 38, align: 'center', fontSize: 12, fontWeight: 700, color: STRUCTURE_UI.faint });
  const hx = cx + gapW;
  drawRoundRect(ctx, { x: hx, y: y + 16, width: hashW, height: 40, radius: 7, fill: `${C.blue}12`, stroke: C.blue, lineWidth: 1.4 });
  label(ctx, '해시', hx + 8, y + 29, hashW - 16, C.blue, 9);
  label(ctx, o.hit ? 'HIT' : 'MISS', hx + 8, y + 45, hashW - 16, o.hit ? C.green : '#b45309', 12);
}

function paintTable(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, o: KeysPaintOptions): void {
  drawRoundRect(ctx, { x, y, width: w, height: h, radius: 8, fill: '#ffffff', stroke: STRUCTURE_UI.panelBorder });
  drawText(ctx, `캐시 저장소 · ${o.entries.length}개 항목`, {
    x: x + 10,
    y: y + 15,
    fontSize: 10,
    fontWeight: 700,
    color: STRUCTURE_UI.sub
  });

  if (o.entries.length === 0) {
    drawText(ctx, '아직 저장된 항목이 없습니다', {
      x: x + w / 2,
      y: y + h / 2 + 4,
      align: 'center',
      fontSize: 10,
      fontWeight: 600,
      color: STRUCTURE_UI.faint
    });
    return;
  }

  const rowH = 17;
  const max = Math.max(1, Math.floor((h - 28) / rowH));
  o.entries.slice(-max).forEach((entry, index) => {
    const ry = y + 30 + index * rowH;
    const isCurrent = o.hit && index === o.entries.slice(-max).length - 1;
    ctx.font = `600 10px ${DEFAULT_FONT_FAMILY}`;
    drawRoundRect(ctx, { x: x + 10, y: ry - 6, width: 3, height: 12, radius: 2, fill: isCurrent ? C.green : C.line });
    label(ctx, entry.label, x + 20, ry, w - 40, isCurrent ? C.green : C.muted, 10);
  });
}

function panel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, title: string, color: string): void {
  drawRoundRect(ctx, { x, y, width: w, height: h, radius: 9, fill: `${color}08`, stroke: `${color}55`, lineWidth: 1.2 });
  drawText(ctx, title, { x: x + 10, y: y + 15, fontSize: 10, fontWeight: 700, color });
}

function card(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, title: string, sub: string, color: string): void {
  drawRoundRect(ctx, { x, y, width: w, height: h, radius: 6, fill: '#ffffff', stroke: `${color}66`, lineWidth: 1 });
  label(ctx, title, x + 10, y + 13, w - 20, color, 11);
  label(ctx, sub, x + 10, y + 26, w - 20, STRUCTURE_UI.faint, 9);
}
